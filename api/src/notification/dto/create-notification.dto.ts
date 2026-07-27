import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'd4af9a1b-da4f-46f6-a145-1bf1e3220d71', description: 'User ID to notify' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'New Announcement (ประกาศใหม่)', description: 'Notification Title' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Maintenance on Friday (ปรับปรุงระบบวันศุกร์)', description: 'Notification Message body' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: NotificationType, example: NotificationType.REMINDER, description: 'Notification Type' })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
