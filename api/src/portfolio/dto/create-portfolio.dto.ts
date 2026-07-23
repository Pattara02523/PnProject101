import { Trim } from '@/common/decorators/trim.decorator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @IsOptional()
  @Trim()
  @IsString()
  color?: string;

  @IsOptional()
  @Trim()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
