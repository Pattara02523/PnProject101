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
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<PortfolioResponseDto[]> {
    return this.portfolioService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePortfolioDto
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.portfolioService.delete(userId, id);
    return {
      message: 'ลบพอร์ตการลงทุนสำเร็จ'
    };
  }
}
