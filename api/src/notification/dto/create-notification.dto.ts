import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';
import { NotificationType } from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
