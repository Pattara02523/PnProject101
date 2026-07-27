import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportService } from './report.service';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ─── CSV ─────────────────────────────────────────────────────────────────

  @Get('portfolio')
  @ApiOperation({ summary: 'Export portfolio report in CSV format (ดาวน์โหลดรายงานพอร์ตในรูปแบบ CSV)' })
  @ApiResponse({ status: 200, description: 'CSV file returned.', type: StreamableFile })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Export transactions report in CSV format (ดาวน์โหลดรายงานธุรกรรมในรูปแบบ CSV)' })
  @ApiResponse({ status: 200, description: 'CSV file returned.', type: StreamableFile })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Export portfolio report in PDF format (ดาวน์โหลดรายงานพอร์ตในรูปแบบ PDF)' })
  @ApiResponse({ status: 200, description: 'PDF file returned.', type: StreamableFile })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Export transactions report in PDF format (ดาวน์โหลดรายงานธุรกรรมในรูปแบบ PDF)' })
  @ApiResponse({ status: 200, description: 'PDF file returned.', type: StreamableFile })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
