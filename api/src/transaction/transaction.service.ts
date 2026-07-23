import { Injectable, NotFoundException } from '@nestjs/common';
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

    return this.prisma.transaction.create({
      data: {
        ...dto,
        transactionDate: new Date(dto.transactionDate)
      }
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

    // Filter transactions by userId through investment -> portfolio ownership chain
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
    await this.findOne(userId, id);

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.transactionDate && {
          transactionDate: new Date(dto.transactionDate)
        })
      }
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);

    await this.prisma.transaction.delete({ where: { id } });
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
}
