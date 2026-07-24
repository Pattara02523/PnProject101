import { Decimal } from '@/database/generated/prisma/internal/prismaNamespace';
import { GoalStatus } from '@/database/generated/prisma/enums';

export class GoalResponseDto {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetAmount: Decimal;
  currentAmount: Decimal;
  progressPercentage: number;
  deadline: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}
