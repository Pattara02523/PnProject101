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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionQueryDto } from './dto/list-transaction-query.dto';
import {
  TransactionResponseDto,
  PaginatedTransactionResponseDto
} from './dto/transaction-response.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() query: ListTransactionQueryDto
  ): Promise<PaginatedTransactionResponseDto> {
    return this.transactionService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TransactionResponseDto> {
    return this.transactionService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    return this.transactionService.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.transactionService.delete(userId, id);
    return { message: 'Transaction deleted successfully (ลบรายการธุรกรรมสำเร็จ)' };
  }
}
