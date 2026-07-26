import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { ListInvestmentQueryDto } from './dto/list-investment-query.dto';
import {
  InvestmentResponseDto,
  PaginatedInvestmentResponseDto
} from './dto/investment-response.dto';
import { InvestmentService } from './investment.service';

@Controller('investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() query: ListInvestmentQueryDto
  ): Promise<PaginatedInvestmentResponseDto> {
    return this.investmentService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.investmentService.delete(userId, id);
    return { message: 'ลบรายการลงทุนสำเร็จ' };
  }
}
