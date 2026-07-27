import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@/common/decorators/trim.decorator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tech Stocks', description: 'Category Name' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'trending-up', description: 'Category Icon name' })
  @IsOptional()
  @Trim()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: '#4caf50', description: 'Category Color theme' })
  @IsOptional()
  @Trim()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'Technology and growth stocks', description: 'Category Description' })
  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Mark as default category' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
