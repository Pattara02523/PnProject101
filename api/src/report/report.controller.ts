import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ─── CSV ─────────────────────────────────────────────────────────────────

  @Get('portfolio')
  async exportPortfolioCsv(
    @CurrentUser('sub') userId: string,
    @Query() query: ReportQueryDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const report = await this.reportService.createPortfolioCsv(userId, query);
    this.setCsvHeaders(response, report.filename);
    return new StreamableFile(report.content);
  }

  @Get('transactions')
  async exportTransactionCsv(
    @CurrentUser('sub') userId: string,
    @Query() query: ReportQueryDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const report = await this.reportService.createTransactionCsv(userId, query);
    this.setCsvHeaders(response, report.filename);
    return new StreamableFile(report.content);
  }

  // ─── PDF ─────────────────────────────────────────────────────────────────

  @Get('portfolio/pdf')
  async exportPortfolioPdf(
    @CurrentUser('sub') userId: string,
    @Query() query: ReportQueryDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const report = await this.reportService.createPortfolioPdf(userId, query);
    this.setPdfHeaders(response, report.filename);
    return new StreamableFile(report.content);
  }

  @Get('transactions/pdf')
  async exportTransactionPdf(
    @CurrentUser('sub') userId: string,
    @Query() query: ReportQueryDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const report = await this.reportService.createTransactionPdf(userId, query);
    this.setPdfHeaders(response, report.filename);
    return new StreamableFile(report.content);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private setCsvHeaders(response: Response, filename: string): void {
    response.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
  }

  private setPdfHeaders(response: Response, filename: string): void {
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
  }
}
