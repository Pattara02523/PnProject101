import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
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
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolios')
@ApiBearerAuth('JWT-auth')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio (สร้างพอร์ตลงทุนใหม่)' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user portfolios (ดูพอร์ตลงทุนทั้งหมดของฉัน)' })
  @ApiResponse({ status: 200, description: 'List of portfolios returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<PortfolioResponseDto[]> {
    return this.portfolioService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a portfolio (ดูพอร์ตการลงทุนเดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Portfolio details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Portfolio not found.' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a portfolio (แก้ไขพอร์ตการลงทุน)' })
  @ApiResponse({ status: 200, description: 'Portfolio updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Portfolio not found.' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio (ลบพอร์ตการลงทุน)' })
  @ApiResponse({ status: 200, description: 'Portfolio deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Portfolio not found.' })
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.portfolioService.delete(userId, id);
    return {
      message: 'Portfolio deleted successfully (ลบพอร์ตการลงทุนสำเร็จ)'
    };
  }
}
