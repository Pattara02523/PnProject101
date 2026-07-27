import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ example: 'System Upgrade (ปรับปรุงระบบ)', description: 'Announcement Title' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'The system will be down for 2 hours on Friday. (ระบบจะปิดปรับปรุงเป็นเวลา 2 ชั่วโมงในวันศุกร์นี้)', description: 'Announcement Message body' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @ApiPropertyOptional({ enum: AnnouncementType, example: AnnouncementType.SYSTEM, description: 'Announcement Type' })
  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @ApiPropertyOptional({ example: 'https://example.com/images/upgrade.png', description: 'Optional banner image URL' })
  @IsOptional()
  @Trim()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Publish status of the announcement' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
