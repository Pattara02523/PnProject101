import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

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
      throw new NotFoundException('ไม่พบหมวดหมู่');
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
    await this.findOne(userId, id);

    // ห้ามลบหมวดหมู่ที่ยังถูกใช้งานโดยรายการลงทุน
    const inUse = await this.prisma.investment.findFirst({
      where: { categoryId: id },
      select: { id: true }
    });

    if (inUse) {
      throw new BadRequestException(
        'ไม่สามารถลบหมวดหมู่นี้ได้ เพราะยังถูกใช้งานโดยรายการลงทุน'
      );
    }

    await this.prisma.category.delete({
      where: { id }
    });
  }
}
