import { Injectable, NotFoundException } from '@nestjs/common';
import { InvestmentWhereInput } from '@/database/generated/prisma/models';
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
    // Verify portfolio belongs to user
    await this.verifyPortfolioOwnership(userId, dto.portfolioId);

    // Verify category belongs to user
    await this.verifyCategoryOwnership(userId, dto.categoryId);

    return this.prisma.investment.create({
      data: {
        ...dto,
        investmentDate: new Date(dto.investmentDate)
      }
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

    // Filter investments by userId through portfolio relation
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
      throw new NotFoundException('Investment not found.');
    }

    return investment;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    await this.findOne(userId, id);

    // If changing portfolio, verify new portfolio belongs to user
    if (dto.portfolioId) {
      await this.verifyPortfolioOwnership(userId, dto.portfolioId);
    }

    // If changing category, verify new category belongs to user
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

  // ── Private helpers ────────────────────────────────────────────

  private async verifyPortfolioOwnership(
    userId: string,
    portfolioId: string
  ): Promise<void> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      select: { id: true }
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found.');
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
      throw new NotFoundException('Category not found.');
    }
  }
}
