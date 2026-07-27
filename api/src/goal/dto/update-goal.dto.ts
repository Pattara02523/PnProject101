import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import { GoalStatus } from '@/database/generated/prisma/enums';
import { Trim } from '@/common/decorators/trim.decorator';

export class UpdateGoalDto {
  @ApiPropertyOptional({ example: 'Buy a car', description: 'Goal Title' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Down payment for a new electric car', description: 'Goal Description' })
  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 300000, description: 'Target financial amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  targetAmount?: number;

  @ApiPropertyOptional({ example: 0, description: 'Current saved financial amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentAmount?: number;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Goal deadline date' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ enum: GoalStatus, example: GoalStatus.IN_PROGRESS, description: 'Goal Status' })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
