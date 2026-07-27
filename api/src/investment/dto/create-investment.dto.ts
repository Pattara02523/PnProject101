import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

import { AssetType, RiskLevel } from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateInvestmentDto {
  @ApiProperty({ example: 'd4af9a1b-da4f-46f6-a145-1bf1e3220d71', description: 'Portfolio ID' })
  @IsUUID()
  portfolioId: string;

  @ApiProperty({ example: '0197465c-e004-4c2a-9273-f2cc1cb85626', description: 'Category ID' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Bitcoin', description: 'Asset Name' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @ApiProperty({ example: 'BTC', description: 'Asset Symbol' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ enum: AssetType, example: AssetType.CRYPTO, description: 'Asset Type' })
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty({ example: 50000, description: 'Purchase price per unit' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: 60000, description: 'Current price per unit' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentPrice: number;

  @ApiProperty({ example: 2.5, description: 'Quantity of units owned' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 50000, description: 'Average cost per unit' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageCost: number;

  @ApiProperty({ enum: RiskLevel, example: RiskLevel.HIGH, description: 'Risk Level' })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty({ example: '2026-01-01', description: 'Date of initial investment' })
  @IsDateString()
  investmentDate: string;

  @ApiPropertyOptional({ example: 'Bought during the dip', description: 'Optional investment note' })
  @IsOptional()
  @Trim()
  @IsString()
  note?: string;
}
