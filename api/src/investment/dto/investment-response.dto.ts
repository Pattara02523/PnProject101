import { Decimal } from '@/database/generated/prisma/internal/prismaNamespace';
import { AssetType, InvestmentStatus, RiskLevel } from '@/database/generated/prisma/enums';

export class InvestmentResponseDto {
  id: string;
  portfolioId: string;
  categoryId: string;
  assetName: string;
  symbol: string;
  assetType: AssetType;
  purchasePrice: Decimal;
  currentPrice: Decimal;
  quantity: Decimal;
  averageCost: Decimal;
  riskLevel: RiskLevel;
  status: InvestmentStatus;
  investmentDate: Date;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedInvestmentResponseDto {
  data: InvestmentResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
