import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
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

export class ListInvestmentQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Bitcoin', description: 'Search by asset name or symbol' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'd4af9a1b-da4f-46f6-a145-1bf1e3220d71', description: 'Filter by Portfolio ID' })
  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @ApiPropertyOptional({ example: '0197465c-e004-4c2a-9273-f2cc1cb85626', description: 'Filter by Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: AssetType, example: AssetType.CRYPTO, description: 'Filter by Asset Type' })
  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @ApiPropertyOptional({ enum: RiskLevel, example: RiskLevel.HIGH, description: 'Filter by Risk Level' })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ enum: InvestmentStatus, example: InvestmentStatus.ACTIVE, description: 'Filter by Investment Status' })
  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Filter by start investment date' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Filter by end investment date' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
