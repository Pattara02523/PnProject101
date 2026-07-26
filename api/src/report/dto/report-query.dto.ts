import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
