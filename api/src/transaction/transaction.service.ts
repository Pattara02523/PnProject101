import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@/database/generated/prisma/client';
import {
  InvestmentStatus,
  TransactionType
} from '@/database/generated/prisma/enums';
import { TransactionWhereInput } from '@/database/generated/prisma/models';
import { PrismaService } from '@/database/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionQueryDto } from './dto/list-transaction-query.dto';
import {
  PaginatedTransactionResponseDto,
  TransactionResponseDto
} from './dto/transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    this.validateTradeFields(dto.type, dto.quantity, dto.price);

    return this.prisma.$transaction(async (tx) => {
      const investment = await this.verifyInvestmentOwnership(
        tx,
        userId,
        dto.investmentId
      );

      // Business Rule: ห้ามซื้อเพิ่มหลัง SOLD (ต้องสร้าง investment ใหม่แทน)
      if (
        dto.type === TransactionType.BUY &&
        investment.status === InvestmentStatus.SOLD
      ) {
        throw new BadRequestException(
          'Cannot buy more because this investment has already been sold out (ไม่สามารถซื้อเพิ่มได้ เพราะรายการลงทุนนี้ถูกขายออกทั้งหมดแล้ว)'
        );
      }

      if (dto.type === TransactionType.SELL) {
        // Business Rule: ห้าม SELL ถ้า investment.status = SOLD อยู่แล้ว
        if (investment.status === InvestmentStatus.SOLD) {
          throw new BadRequestException(
            'Cannot sell because this investment has already been sold out (ไม่สามารถขายได้ เพราะรายการลงทุนนี้ถูกขายออกทั้งหมดแล้ว)'
          );
        }

        await this.verifySellQuantity(tx, userId, dto.investmentId, dto.quantity);
      }

      const transaction = await tx.transaction.create({
        data: {
          ...dto,
          transactionDate: new Date(dto.transactionDate)
        }
      });

      // บันทึกธุรกรรมและยอดสรุปการลงทุนต้องสำเร็จหรือล้มเหลวพร้อมกัน
      await this.recalculateInvestmentSummary(tx, dto.investmentId);
      return transaction;
    });
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
      investment: { portfolio: { userId } },
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
        orderBy: { transactionDate: 'desc' },
        include: {
          investment: {
            select: {
              id: true,
              assetName: true,
              symbol: true,
              portfolioId: true,
              portfolio: { select: { id: true, name: true } }
            }
          }
        }
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
    return this.findOneWithClient(this.prisma, userId, id);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await this.findOneWithClient(tx, userId, id);
      const type = dto.type ?? existing.type;
      const quantity = dto.quantity ?? Number(existing.quantity);
      const price = dto.price ?? Number(existing.price);

      this.validateTradeFields(type, quantity, price);


      if (type === TransactionType.SELL) {
        const previousSellQuantity =
          existing.type === TransactionType.SELL
            ? Number(existing.quantity)
            : 0;
        await this.verifySellQuantity(
          tx,
          userId,
          existing.investmentId,
          quantity,
          previousSellQuantity
        );
      }

      const updated = await tx.transaction.update({
        where: { id },
        data: {
          ...dto,
          ...(dto.transactionDate && {
            transactionDate: new Date(dto.transactionDate)
          })
        }
      });

      await this.recalculateInvestmentSummary(tx, existing.investmentId);
      return updated;
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await this.findOneWithClient(tx, userId, id);

      await tx.transaction.delete({ where: { id } });
      await this.recalculateInvestmentSummary(tx, existing.investmentId);
    });
  }

  private validateTradeFields(
    type: TransactionType,
    quantity?: number,
    price?: number
  ): void {
    if (
      (type === TransactionType.BUY || type === TransactionType.SELL) &&
      (!quantity || quantity <= 0 || !price || price <= 0)
    ) {
      throw new BadRequestException(
        'Buy and Sell transactions must specify quantity and price greater than 0 (รายการซื้อและขายต้องระบุจำนวนและราคาที่มากกว่า 0)'
      );
    }
  }

  // คืนค่า investment เพื่อให้ caller ตรวจ status ได้
  private async verifyInvestmentOwnership(
    prisma: Prisma.TransactionClient,
    userId: string,
    investmentId: string
  ): Promise<{ status: InvestmentStatus }> {
    const investment = await prisma.investment.findFirst({
      where: { id: investmentId, portfolio: { userId } },
      select: { id: true, status: true }
    });

    if (!investment) {
      throw new NotFoundException('Investment not found (ไม่พบรายการลงทุน)');
    }

    return investment;
  }

  private async verifySellQuantity(
    prisma: Prisma.TransactionClient,
    userId: string,
    investmentId: string,
    quantity: number | undefined,
    previousSellQuantity = 0
  ): Promise<void> {
    const investment = await prisma.investment.findFirst({
      where: { id: investmentId, portfolio: { userId } },
      select: { quantity: true }
    });

    if (!investment) {
      throw new NotFoundException('Investment not found (ไม่พบรายการลงทุน)');
    }

    const availableQuantity =
      Number(investment.quantity) + previousSellQuantity;

    if (!quantity || quantity > availableQuantity) {
      throw new BadRequestException(
        `Cannot sell ${quantity ?? 0} units because you only hold ${availableQuantity} units (ไม่สามารถขาย ${quantity ?? 0} หน่วยได้ เพราะถือครองอยู่เพียง ${availableQuantity} หน่วย)`
      );
    }
  }

  // คำนวณยอดคงเหลือและต้นทุนเฉลี่ยจากประวัติธุรกรรมตามลำดับเวลา
  private async recalculateInvestmentSummary(
    prisma: Prisma.TransactionClient,
    investmentId: string
  ): Promise<void> {
    const transactions = await prisma.transaction.findMany({
      where: { investmentId },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }]
    });

    const hasTrade = transactions.some(
      (transaction) =>
        transaction.type === TransactionType.BUY ||
        transaction.type === TransactionType.SELL
    );

    // DIVIDEND, DEPOSIT และ WITHDRAW ไม่ควรล้างยอดลงทุนที่สร้างไว้เดิม
    if (!hasTrade) {
      return;
    }

    let totalQuantity = 0;
    let currentAverageCost = 0;

    for (const transaction of transactions) {
      const quantity = Number(transaction.quantity ?? 0);
      const price = Number(transaction.price ?? 0);

      if (transaction.type === TransactionType.BUY) {
        const totalCostBefore = totalQuantity * currentAverageCost;
        totalQuantity += quantity;
        currentAverageCost =
          totalQuantity > 0
            ? (totalCostBefore + quantity * price) / totalQuantity
            : 0;
      }

      if (transaction.type === TransactionType.SELL) {
        totalQuantity -= quantity;

        if (totalQuantity < 0) {
          throw new BadRequestException('Cannot sell more than the holding amount (ไม่สามารถขายเกินจำนวนที่ถือครอง)');
        }

        if (totalQuantity === 0) {
          currentAverageCost = 0;
        }
      }
    }

    await prisma.investment.update({
      where: { id: investmentId },
      data: {
        quantity: totalQuantity,
        averageCost: currentAverageCost,
        status:
          totalQuantity > 0 ? InvestmentStatus.ACTIVE : InvestmentStatus.SOLD
      }
    });
  }

  private async findOneWithClient(
    prisma: Pick<Prisma.TransactionClient, 'transaction'>,
    userId: string,
    id: string
  ): Promise<TransactionResponseDto> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, investment: { portfolio: { userId } } },
      include: {
        investment: {
          select: {
            id: true,
            assetName: true,
            symbol: true,
            portfolioId: true,
            portfolio: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found (ไม่พบรายการธุรกรรม)');
    }

    return transaction;
  }
}
