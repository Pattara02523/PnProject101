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
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @IsOptional()
  @Trim()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
