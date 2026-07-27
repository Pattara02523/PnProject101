import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@/common/decorators/trim.decorator';
import { AnnouncementType } from '@/database/generated/prisma/enums';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'System Upgrade (ปรับปรุงระบบ)', description: 'Announcement Title' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The system will be down for 2 hours on Friday. (ระบบจะปิดปรับปรุงเป็นเวลา 2 ชั่วโมงในวันศุกร์นี้)', description: 'Announcement Message body' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ enum: AnnouncementType, example: AnnouncementType.SYSTEM, description: 'Announcement Type' })
  @IsEnum(AnnouncementType)
  @IsNotEmpty()
  type: AnnouncementType;

  @ApiPropertyOptional({ example: 'https://example.com/images/upgrade.png', description: 'Optional banner image URL' })
  @IsOptional()
  @Trim()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Immediately publish the announcement' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
