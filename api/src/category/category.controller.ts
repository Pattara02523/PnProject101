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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category (สร้างหมวดหมู่ใหม่)' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user categories (ดูหมวดหมู่ทั้งหมดของฉัน)' })
  @ApiResponse({ status: 200, description: 'List of categories returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<CategoryResponseDto[]> {
    return this.categoryService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a category (ดูหมวดหมู่เดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Category details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category (แก้ไขหมวดหมู่)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (ลบหมวดหมู่)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot delete category in use by investments.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
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
