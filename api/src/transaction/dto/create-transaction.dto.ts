import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from 'class-validator';

import { TransactionType } from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'eba4ea8c-c815-4158-829f-a7a660349b8f', description: 'Investment ID' })
  @IsUUID()
  investmentId: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.BUY, description: 'Transaction Type' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ example: 1, description: 'Quantity (required for BUY and SELL)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 60000, description: 'Price per unit (required for BUY and SELL)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiProperty({ example: 60000, description: 'Total transaction amount (must be > 0)' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 10, description: 'Transaction Fee' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fee?: number;

  @ApiPropertyOptional({ example: 7, description: 'Transaction Tax' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax?: number;

  @ApiProperty({ example: '2026-07-27', description: 'Transaction Date' })
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional({ example: 'Buy order #1', description: 'Optional transaction note' })
  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
