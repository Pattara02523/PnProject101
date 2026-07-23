import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from 'class-validator';

import { TransactionType } from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateTransactionDto {
  @IsUUID()
  investmentId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  // Required for BUY / SELL, optional for DIVIDEND / DEPOSIT / WITHDRAW
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  // Always required — the total monetary value of the transaction
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fee?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax?: number;

  @IsDateString()
  transactionDate: string;

  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
