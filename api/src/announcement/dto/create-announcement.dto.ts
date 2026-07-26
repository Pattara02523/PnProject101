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
  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(AnnouncementType)
  @IsNotEmpty()
  type: AnnouncementType;

  @IsOptional()
  @Trim()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
