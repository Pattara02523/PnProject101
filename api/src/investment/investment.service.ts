import { Injectable, NotFoundException } from '@nestjs/common';
import { InvestmentWhereInput } from '@/database/generated/prisma/models';
import { TransactionType } from '@/database/generated/prisma/enums';
import { PrismaService } from '@/database/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { ListInvestmentQueryDto } from './dto/list-investment-query.dto';
import {
  InvestmentResponseDto,
  PaginatedInvestmentResponseDto
} from './dto/investment-response.dto';

@Injectable()
export class InvestmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    // ตรวจว่าพอร์ตการลงทุนเป็นของผู้ใช้คนปัจจุบัน
    await this.verifyPortfolioOwnership(userId, dto.portfolioId);

    // ตรวจว่าหมวดหมู่เป็นของผู้ใช้คนปัจจุบัน
    await this.verifyCategoryOwnership(userId, dto.categoryId);

    return this.prisma.$transaction(async (tx) => {
      const investment = await tx.investment.create({
        data: {
          ...dto,
          investmentDate: new Date(dto.investmentDate)
        }
      });

      if (Number(dto.quantity) > 0) {
        await tx.transaction.create({
          data: {
            investmentId: investment.id,
            type: TransactionType.BUY,
            quantity: dto.quantity,
            price: dto.purchasePrice,
            amount: Number(dto.quantity) * Number(dto.purchasePrice),
            transactionDate: new Date(dto.investmentDate),
            note: 'รายการซื้อเริ่มต้น'
          }
        });
      }

      return investment;
    });
  }

  async findAll(
    userId: string,
    query: ListInvestmentQueryDto
  ): Promise<PaginatedInvestmentResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      portfolioId,
      categoryId,
      assetType,
      riskLevel,
      status,
      dateFrom,
      dateTo
    } = query;

    const skip = (page - 1) * limit;

    // กรองให้เหลือเฉพาะรายการลงทุนในพอร์ตของผู้ใช้
    const where: InvestmentWhereInput = {
      portfolio: { userId },
      ...(portfolioId && { portfolioId }),
      ...(categoryId && { categoryId }),
      ...(assetType && { assetType }),
      ...(riskLevel && { riskLevel }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { assetName: { contains: search, mode: 'insensitive' } },
          { symbol: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(dateFrom || dateTo
        ? {
            investmentDate: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) })
            }
          }
        : {})
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.investment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.investment.count({ where })
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

  async findOne(userId: string, id: string): Promise<InvestmentResponseDto> {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId }
      }
    });

    if (!investment) {
      throw new NotFoundException('ไม่พบรายการลงทุน');
    }

    return investment;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    await this.findOne(userId, id);

    // เมื่อต้องย้ายพอร์ต ต้องตรวจว่าพอร์ตปลายทางเป็นของผู้ใช้
    if (dto.portfolioId) {
      await this.verifyPortfolioOwnership(userId, dto.portfolioId);
    }

    // เมื่อเปลี่ยนหมวดหมู่ ต้องตรวจว่าหมวดหมู่เป็นของผู้ใช้
    if (dto.categoryId) {
      await this.verifyCategoryOwnership(userId, dto.categoryId);
    }

    return this.prisma.investment.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.investmentDate && {
          investmentDate: new Date(dto.investmentDate)
        })
      }
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);

    await this.prisma.investment.delete({ where: { id } });
  }

  // เมธอดช่วยตรวจสอบความเป็นเจ้าของข้อมูล

  private async verifyPortfolioOwnership(
    userId: string,
    portfolioId: string
  ): Promise<void> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      select: { id: true }
    });

    if (!portfolio) {
      throw new NotFoundException('ไม่พบพอร์ตการลงทุน');
    }
  }

  private async verifyCategoryOwnership(
    userId: string,
    categoryId: string
  ): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true }
    });

    if (!category) {
      throw new NotFoundException('ไม่พบหมวดหมู่');
    }
  }
}
