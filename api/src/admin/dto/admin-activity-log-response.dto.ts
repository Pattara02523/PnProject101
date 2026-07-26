import { ActivityAction } from '@/database/generated/prisma/enums';

export class AdminActivityLogResponseDto {
  id: string;
  userId: string;
  action: ActivityAction;
  module: string;
  entityId: string | null;
  description: string | null;
  ipAddress: string | null;
  browser: string | null;
  device: string | null;
  createdAt: Date;
}

export class PaginatedActivityLogResponseDto {
  data: AdminActivityLogResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
