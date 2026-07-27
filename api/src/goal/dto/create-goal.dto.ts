import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateGoalDto {
  @ApiProperty({ example: 'Buy a car', description: 'Goal Title' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Down payment for a new electric car', description: 'Goal Description' })
  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @ApiProperty({ example: 300000, description: 'Target financial amount (must be > 0)' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  targetAmount: number;

  @ApiPropertyOptional({ example: 0, description: 'Current saved financial amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentAmount?: number = 0;

  @ApiProperty({ example: '2026-12-31', description: 'Goal deadline date' })
  @IsDateString()
  @IsNotEmpty()
  deadline: string;
}
