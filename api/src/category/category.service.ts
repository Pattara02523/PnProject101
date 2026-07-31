import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
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
    return this.prisma.category.create({
      data: {
        ...dto,
        userId
      }
    });
  }

  async findAll(userId: string): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });
  }

  async findOne(userId: string, id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId }
    });

    if (!category) {
      throw new NotFoundException('Category not found (ไม่พบหมวดหมู่)');
    }

    return category;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    await this.findOne(userId, id);

    return this.prisma.category.update({
      where: { id },
      data: dto
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    // 1. ตรวจสอบว่ามี Category อยู่ในระบบของ User หรือไม่
    await this.findOne(userId, id);

    // 2. ตรวจสอบการใช้งานล่วงหน้าก่อนลบ (Restrict pattern)
    const inUse = await this.prisma.investment.findFirst({
      where: { categoryId: id },
      select: { id: true }
    });

    if (inUse) {
      throw new BadRequestException(
        'Cannot delete category because it is being used by investments.'
      );
    }

    // 3. ทำการลบโดยมี Try-Catch ป้องกัน Foreign Key Violation (P2003)
    try {
      await this.prisma.category.delete({
        where: { id }
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
