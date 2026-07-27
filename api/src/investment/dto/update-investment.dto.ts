import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: 'd4af9a1b-da4f-46f6-a145-1bf1e3220d71', description: 'Portfolio ID' })
  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @ApiPropertyOptional({ example: '0197465c-e004-4c2a-9273-f2cc1cb85626', description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Bitcoin', description: 'Asset Name' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  assetName?: string;

  @ApiPropertyOptional({ example: 'BTC', description: 'Asset Symbol' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  symbol?: string;

  @ApiPropertyOptional({ enum: AssetType, example: AssetType.CRYPTO, description: 'Asset Type' })
  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @ApiPropertyOptional({ example: 50000, description: 'Purchase price per unit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional({ example: 60000, description: 'Current price per unit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentPrice?: number;

  @ApiPropertyOptional({ example: 2.5, description: 'Quantity of units owned' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 50000, description: 'Average cost per unit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageCost?: number;

  @ApiPropertyOptional({ enum: RiskLevel, example: RiskLevel.HIGH, description: 'Risk Level' })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ enum: InvestmentStatus, example: InvestmentStatus.ACTIVE, description: 'Investment Status' })
  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Date of initial investment' })
  @IsOptional()
  @IsDateString()
  investmentDate?: string;

  @ApiPropertyOptional({ example: 'Bought during the dip', description: 'Optional investment note' })
  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
