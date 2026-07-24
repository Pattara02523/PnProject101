import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InvestmentStatus, TransactionType } from '@/database/generated/prisma/enums';
import { TransactionWhereInput } from '@/database/generated/prisma/models';
import { PrismaService } from '@/database/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionQueryDto } from './dto/list-transaction-query.dto';
import {
  TransactionResponseDto,
  PaginatedTransactionResponseDto
} from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    // Verify investment belongs to user via ownership chain: investment -> portfolio -> user
    await this.verifyInvestmentOwnership(userId, dto.investmentId);

    // If SELL, check if quantity to sell exceeds current investment quantity
    if (dto.type === TransactionType.SELL && dto.quantity) {
      const investment = await this.prisma.investment.findUnique({
        where: { id: dto.investmentId },
        select: { quantity: true }
      });

      if (investment && Number(dto.quantity) > Number(investment.quantity)) {
        throw new BadRequestException(
          `Cannot sell ${dto.quantity} units. Current holding is only ${investment.quantity} units.`
        );
      }
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        ...dto,
        transactionDate: new Date(dto.transactionDate)
      }
    });

    // Auto-recalculate quantity, averageCost, and status on the Investment
    await this.recalculateInvestmentSummary(dto.investmentId);

    return transaction;
  }

  async findAll(
    userId: string,
    query: ListTransactionQueryDto
  ): Promise<PaginatedTransactionResponseDto> {
    const {
      page = 1,
      limit = 10,
      investmentId,
      type,
      dateFrom,
      dateTo
    } = query;

    const skip = (page - 1) * limit;

    const where: TransactionWhereInput = {
      investment: {
        portfolio: { userId }
      },
      ...(investmentId && { investmentId }),
      ...(type && { type }),
      ...(dateFrom || dateTo
        ? {
            transactionDate: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) })
            }
          }
        : {})
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' }
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: { userId }
        }
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    return transaction;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    const existing = await this.findOne(userId, id);

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.transactionDate && {
          transactionDate: new Date(dto.transactionDate)
        })
      }
    });

    // Auto-recalculate quantity, averageCost, and status on the Investment
    await this.recalculateInvestmentSummary(existing.investmentId);

    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.findOne(userId, id);

    await this.prisma.transaction.delete({ where: { id } });

    // Auto-recalculate quantity, averageCost, and status on the Investment
    await this.recalculateInvestmentSummary(existing.investmentId);
  }

  // ── Private helpers ────────────────────────────────────────────

  private async verifyInvestmentOwnership(
    userId: string,
    investmentId: string
  ): Promise<void> {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id: investmentId,
        portfolio: { userId }
      },
      select: { id: true }
    });

    if (!investment) {
      throw new NotFoundException('Investment not found.');
    }
  }

  /**
   * Recalculates total quantity, average cost basis (Weighted Average Cost),
   * and status (ACTIVE / SOLD) for an investment based on all its transactions.
   */
  private async recalculateInvestmentSummary(
    investmentId: string
  ): Promise<void> {
    const transactions = await this.prisma.transaction.findMany({
      where: { investmentId },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }]
    });

    let totalQuantity = 0;
    let currentAvgCost = 0;

    for (const tx of transactions) {
      const qty = tx.quantity ? Number(tx.quantity) : 0;
      const price = tx.price ? Number(tx.price) : 0;

      if (tx.type === TransactionType.BUY) {
        const totalCostBefore = totalQuantity * currentAvgCost;
        const buyCost = qty * price;
        totalQuantity += qty;
        currentAvgCost = totalQuantity > 0 ? (totalCostBefore + buyCost) / totalQuantity : 0;
      } else if (tx.type === TransactionType.SELL) {
        totalQuantity = Math.max(0, totalQuantity - qty);
        if (totalQuantity === 0) {
          currentAvgCost = 0;
        }
        // When selling, average cost per unit remains unchanged for remaining shares
      }
    }

    const status =
      totalQuantity > 0 ? InvestmentStatus.ACTIVE : InvestmentStatus.SOLD;

    await this.prisma.investment.update({
      where: { id: investmentId },
      data: {
        quantity: totalQuantity,
        averageCost: currentAvgCost,
        status
      }
    });
  }
}
