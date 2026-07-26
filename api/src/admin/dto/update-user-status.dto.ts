import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@/database/generated/prisma/enums';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
