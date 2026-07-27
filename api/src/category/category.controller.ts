import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<CategoryResponseDto[]> {
    return this.categoryService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.categoryService.delete(userId, id);
    return {
      message: 'Category deleted successfully (ลบหมวดหมู่สำเร็จ)'
    };
  }
}
