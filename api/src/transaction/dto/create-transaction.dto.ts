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
  @IsUUID()
  investmentId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  // BUY และ SELL ต้องส่งค่า ส่วนประเภทอื่นไม่จำเป็นต้องส่ง
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

  // จำนวนเงินรวมของรายการ เป็นข้อมูลที่ต้องส่งเสมอ
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
