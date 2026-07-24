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
  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @Trim()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  targetAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentAmount?: number = 0;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;
}
