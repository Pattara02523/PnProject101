import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@/database/generated/prisma/enums';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.SUSPENDED, description: 'Updated user account status' })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
