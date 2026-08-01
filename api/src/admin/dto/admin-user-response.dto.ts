import { UserRole, UserStatus } from '@/database/generated/prisma/enums';

export class AdminUserResponseDto {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    portfolios: number;
    transactions: number;
    goals?: number;
  };
}

export class PaginatedAdminUserResponseDto {
  data: AdminUserResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
