import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma } from '@/database/generated/prisma/client';
import { ActivityAction } from '@/database/generated/prisma/enums';
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

      const portfolio = await tx.portfolio.create({
        data: {
          ...dto,
          userId
        }
      });

      await tx.activityLog.create({
        data: {
          userId,
          action: ActivityAction.CREATE,
          module: 'PORTFOLIO',
          entityId: portfolio.id,
          description: `Created portfolio "${portfolio.name}"`
        }
      });

      return portfolio;
    });
  }

  async findAll(userId: string): Promise<PortfolioResponseDto[]> {
    return this.prisma.portfolio.findMany({
      where: { userId },
      include: {
        _count: {
          select: { investments: true }
        }
      },
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
      throw new NotFoundException('Portfolio not found (ไม่พบพอร์ตการลงทุน)');
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
        throw new NotFoundException('Portfolio not found (ไม่พบพอร์ตการลงทุน)');
      }

      if (dto.isDefault) {
        await this.unsetDefaultPortfolios(tx, userId, id);
      }

      const updated = await tx.portfolio.update({
        where: { id },
        data: dto
      });

      await tx.activityLog.create({
        data: {
          userId,
          action: ActivityAction.UPDATE,
          module: 'PORTFOLIO',
          entityId: updated.id,
          description: `Updated portfolio "${updated.name}"`
        }
      });

      return updated;
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOne(userId, id);

    await this.prisma.portfolio.delete({
      where: { id }
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.DELETE,
        module: 'PORTFOLIO',
        entityId: id,
        description: `Deleted portfolio "${portfolio.name}"`
      }
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
