import { Decimal } from '@/database/generated/prisma/internal/prismaNamespace';
import { TransactionType } from '@/database/generated/prisma/enums';

export class TransactionResponseDto {
  id: string;
  investmentId: string;
  type: TransactionType;
  quantity: Decimal | null;
  price: Decimal | null;
  amount: Decimal;
  fee: Decimal | null;
  tax: Decimal | null;
  transactionDate: Date;
  note: string | null;
  createdAt: Date;
}

export class PaginatedTransactionResponseDto {
  data: TransactionResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
