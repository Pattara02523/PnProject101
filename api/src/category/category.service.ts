import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ActivityAction } from '@/database/generated/prisma/enums';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Prisma } from '@/database/generated/prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.create({
      data: {
        ...dto,
        userId
      }
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.CREATE,
        module: 'CATEGORY',
        entityId: category.id,
        description: `Created category "${category.name}"`
      }
    });

    return category;
  }

  async findAll(userId: string): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { investments: true }
        }
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });
  }

  async findOne(userId: string, id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { investments: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found (ไม่พบหมวดหมู่)');
    }

    return category as CategoryResponseDto;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    await this.findOne(userId, id);

    const updated = await this.prisma.category.update({
      where: { id },
      data: dto
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.UPDATE,
        module: 'CATEGORY',
        entityId: updated.id,
        description: `Updated category "${updated.name}"`
      }
    });

    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const category = await this.findOne(userId, id);

    const inUse = await this.prisma.investment.findFirst({
      where: { categoryId: id },
      select: { id: true }
    });

    if (inUse) {
      throw new BadRequestException(
        'Cannot delete category because it is being used by investments.'
      );
    }

    try {
      await this.prisma.category.delete({
        where: { id }
      });

      await this.prisma.activityLog.create({
        data: {
          userId,
          action: ActivityAction.DELETE,
          module: 'CATEGORY',
          entityId: id,
          description: `Deleted category "${category.name}"`
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Cannot delete category because it is being used by investments.'
        );
      }
      throw error;
    }
  }
}
