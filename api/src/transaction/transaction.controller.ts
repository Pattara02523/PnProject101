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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction (สร้างรายการธุรกรรมใหม่)' })
  @ApiResponse({ status: 201, description: 'Transaction recorded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid type, sold status or quantity mismatch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter transactions (ดูและกรองรายการธุรกรรมทั้งหมด)' })
  @ApiResponse({ status: 200, description: 'Paginated list of transactions returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() query: ListTransactionQueryDto
  ): Promise<PaginatedTransactionResponseDto> {
    return this.transactionService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a transaction (ดูข้อมูลธุรกรรมเดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Transaction details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TransactionResponseDto> {
    return this.transactionService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction (แก้ไขรายการธุรกรรม)' })
  @ApiResponse({ status: 200, description: 'Transaction updated and investment recalculated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request or invalid sell quantity.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    return this.transactionService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction (ลบรายการธุรกรรม)' })
  @ApiResponse({ status: 200, description: 'Transaction deleted and investment recalculated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.transactionService.delete(userId, id);
    return { message: 'Transaction deleted successfully (ลบรายการธุรกรรมสำเร็จ)' };
  }
}
