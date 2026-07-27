import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@/common/decorators/trim.decorator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'My Retirement Portfolio', description: 'Portfolio Name' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Long-term stocks and ETFs for retirement', description: 'Portfolio Description' })
  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#ff5733', description: 'Portfolio Color theme' })
  @IsOptional()
  @Trim()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'briefcase', description: 'Portfolio Icon name' })
  @IsOptional()
  @Trim()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: false, description: 'Mark as favorite portfolio' })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Mark as default portfolio (only one default portfolio allowed per user)' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
