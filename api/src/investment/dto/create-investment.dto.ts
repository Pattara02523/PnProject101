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

import {
  AssetType,
  RiskLevel
} from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateInvestmentDto {
  @IsUUID()
  portfolioId: string;

  @IsUUID()
  categoryId: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsEnum(AssetType)
  assetType: AssetType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentPrice: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageCost: number;

  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsDateString()
  investmentDate: string;

  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
