import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma } from '@/database/generated/prisma/client';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await this.unsetDefaultPortfolios(tx, userId);
      }

      return tx.portfolio.create({
        data: {
          ...dto,
          userId
        }
      });
    });
  }

  async findAll(userId: string): Promise<PortfolioResponseDto[]> {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { isFavorite: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async findOne(userId: string, id: string): Promise<PortfolioResponseDto> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId }
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found.');
    }

    return portfolio;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const portfolio = await tx.portfolio.findFirst({
        where: { id, userId }
      });

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found.');
      }

      if (dto.isDefault) {
        await this.unsetDefaultPortfolios(tx, userId, id);
      }

      return tx.portfolio.update({
        where: { id },
        data: dto
      });
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);

    await this.prisma.portfolio.delete({
      where: { id }
    });
  }

  private async unsetDefaultPortfolios(
    prisma: Prisma.TransactionClient,
    userId: string,
    excludeId?: string
  ): Promise<void> {
    await prisma.portfolio.updateMany({
      where: {
        userId,
        isDefault: true,
        ...(excludeId ? { id: { not: excludeId } } : {})
      },
      data: { isDefault: false }
    });
  }
}
