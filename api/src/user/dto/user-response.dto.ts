import { UserRole, UserStatus } from '@/database/generated/prisma/enums';

export class UserResponseDto {
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
}
