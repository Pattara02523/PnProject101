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
  InvestmentStatus,
  RiskLevel
} from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class UpdateInvestmentDto {
  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  assetName?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  symbol?: string;

  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageCost?: number;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @IsOptional()
  @IsDateString()
  investmentDate?: string;

  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
