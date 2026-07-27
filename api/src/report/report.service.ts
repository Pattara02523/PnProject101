import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';
import { PrismaService } from '@/database/prisma.service';
import { Prisma } from '@/database/generated/prisma/client';
import { ReportQueryDto } from './dto/report-query.dto';

type FileReport = {
  filename: string;
  content: Buffer;
};

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CSV ────────────────────────────────────────────────────────────────────

  async createPortfolioCsv(
    userId: string,
    query: ReportQueryDto
  ): Promise<FileReport> {
    this.validateDateRange(query);
    await this.ensurePortfolioOwnership(userId, query.portfolioId);

    const investments = await this.prisma.investment.findMany({
      where: {
        portfolio: {
          userId,
          ...(query.portfolioId ? { id: query.portfolioId } : {})
        },
        ...(this.toDateFilter(
          'investmentDate',
          query
        ) as Prisma.InvestmentWhereInput)
      },
      include: {
        portfolio: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: [{ investmentDate: 'desc' }, { assetName: 'asc' }]
    });

    const rows = investments.map((investment) => {
      const quantity = Number(investment.quantity);
      const averageCost = Number(investment.averageCost);
      const currentPrice = Number(investment.currentPrice);
      const costValue = quantity * averageCost;
      const currentValue = quantity * currentPrice;
      const profitLoss = currentValue - costValue;
      const roi = costValue === 0 ? 0 : (profitLoss / costValue) * 100;

      return [
        investment.portfolio.name,
        investment.category.name,
        investment.assetName,
        investment.symbol,
        investment.assetType,
        investment.status,
        this.toNumberString(quantity, 4),
        this.toNumberString(averageCost),
        this.toNumberString(currentPrice),
        this.toNumberString(costValue),
        this.toNumberString(currentValue),
        this.toNumberString(profitLoss),
        this.toNumberString(roi),
        this.toDateString(investment.investmentDate),
        investment.note ?? ''
      ];
    });

    return this.toCsvReport(
      'portfolio-report',
      [
        'Portfolio', 'Category', 'Asset name', 'Symbol', 'Asset type',
        'Status', 'Quantity', 'Average cost', 'Current price', 'Cost value',
        'Current value', 'Profit/Loss', 'ROI (%)', 'Investment date', 'Note'
      ],
      rows
    );
  }

  async createTransactionCsv(
    userId: string,
    query: ReportQueryDto
  ): Promise<FileReport> {
    this.validateDateRange(query);
    await this.ensurePortfolioOwnership(userId, query.portfolioId);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        investment: {
          portfolio: {
            userId,
            ...(query.portfolioId ? { id: query.portfolioId } : {})
          }
        },
        ...(this.toDateFilter(
          'transactionDate',
          query
        ) as Prisma.TransactionWhereInput)
      },
      include: {
        investment: {
          select: {
            assetName: true,
            symbol: true,
            portfolio: { select: { name: true } }
          }
        }
      },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }]
    });

    const rows = transactions.map((transaction) => [
      transaction.investment.portfolio.name,
      transaction.investment.assetName,
      transaction.investment.symbol,
      transaction.type,
      transaction.quantity === null
        ? ''
        : this.toNumberString(Number(transaction.quantity), 4),
      transaction.price === null
        ? ''
        : this.toNumberString(Number(transaction.price)),
      this.toNumberString(Number(transaction.amount)),
      transaction.fee === null ? '' : this.toNumberString(Number(transaction.fee)),
      transaction.tax === null ? '' : this.toNumberString(Number(transaction.tax)),
      transaction.transactionDate.toISOString(),
      transaction.note ?? ''
    ]);

    return this.toCsvReport(
      'transaction-report',
      [
        'Portfolio', 'Asset name', 'Symbol', 'Type', 'Quantity', 'Price',
        'Amount', 'Fee', 'Tax', 'Transaction date', 'Note'
      ],
      rows
    );
  }

  // ─── PDF (Option B — Styled Table) ──────────────────────────────────────────

  async createPortfolioPdf(
    userId: string,
    query: ReportQueryDto
  ): Promise<FileReport> {
    this.validateDateRange(query);
    await this.ensurePortfolioOwnership(userId, query.portfolioId);

    const investments = await this.prisma.investment.findMany({
      where: {
        portfolio: {
          userId,
          ...(query.portfolioId ? { id: query.portfolioId } : {})
        },
        ...(this.toDateFilter('investmentDate', query) as Prisma.InvestmentWhereInput)
      },
      include: {
        portfolio: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: [{ investmentDate: 'desc' }, { assetName: 'asc' }]
    });

    const headers = [
      'Asset', 'Portfolio', 'Category', 'Type', 'Qty',
      'Avg Cost', 'Cur Price', 'Cost Val', 'Cur Val', 'P&L', 'ROI%'
    ];
    const colWidths = [90, 70, 70, 50, 45, 55, 55, 55, 55, 55, 45];

    const rows = investments.map((inv) => {
      const qty = Number(inv.quantity);
      const avg = Number(inv.averageCost);
      const cur = Number(inv.currentPrice);
      const cost = qty * avg;
      const curVal = qty * cur;
      const pl = curVal - cost;
      const roi = cost === 0 ? 0 : (pl / cost) * 100;
      return [
        inv.assetName,
        inv.portfolio.name,
        inv.category.name,
        inv.assetType,
        this.toNumberString(qty, 4),
        this.toNumberString(avg),
        this.toNumberString(cur),
        this.toNumberString(cost),
        this.toNumberString(curVal),
        this.toNumberString(pl),
        `${this.toNumberString(roi)}%`
      ];
    });

    const content = await this.buildPdf(
      'Portfolio Report',
      query,
      headers,
      colWidths,
      rows
    );

    return {
      filename: `portfolio-report-${this.toFilenameTimestamp()}.pdf`,
      content
    };
  }

  async createTransactionPdf(
    userId: string,
    query: ReportQueryDto
  ): Promise<FileReport> {
    this.validateDateRange(query);
    await this.ensurePortfolioOwnership(userId, query.portfolioId);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        investment: {
          portfolio: {
            userId,
            ...(query.portfolioId ? { id: query.portfolioId } : {})
          }
        },
        ...(this.toDateFilter('transactionDate', query) as Prisma.TransactionWhereInput)
      },
      include: {
        investment: {
          select: {
            assetName: true,
            symbol: true,
            portfolio: { select: { name: true } }
          }
        }
      },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }]
    });

    const headers = ['Portfolio', 'Asset', 'Symbol', 'Type', 'Qty', 'Price', 'Amount', 'Fee', 'Tax', 'Date'];
    const colWidths = [85, 85, 55, 45, 45, 55, 55, 40, 40, 95];

    const rows = transactions.map((t) => [
      t.investment.portfolio.name,
      t.investment.assetName,
      t.investment.symbol,
      t.type,
      t.quantity ? this.toNumberString(Number(t.quantity), 4) : '-',
      t.price ? this.toNumberString(Number(t.price)) : '-',
      this.toNumberString(Number(t.amount)),
      t.fee ? this.toNumberString(Number(t.fee)) : '-',
      t.tax ? this.toNumberString(Number(t.tax)) : '-',
      this.toDateString(t.transactionDate)
    ]);

    const content = await this.buildPdf(
      'Transaction Report',
      query,
      headers,
      colWidths,
      rows
    );

    return {
      filename: `transaction-report-${this.toFilenameTimestamp()}.pdf`,
      content
    };
  }

  // ─── PDF Builder ─────────────────────────────────────────────────────────────

  private buildPdf(
    title: string,
    query: ReportQueryDto,
    headers: string[],
    colWidths: number[],
    rows: string[][]
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      let regularFont = 'Helvetica';
      let boldFont = 'Helvetica-Bold';

      const tahomaPath = 'C:/Windows/Fonts/tahoma.ttf';
      const tahomaBoldPath = 'C:/Windows/Fonts/tahomabd.ttf';

      if (fs.existsSync(tahomaPath)) {
        doc.registerFont('ThaiFont', tahomaPath);
        regularFont = 'ThaiFont';
      }
      if (fs.existsSync(tahomaBoldPath)) {
        doc.registerFont('ThaiFont-Bold', tahomaBoldPath);
        boldFont = 'ThaiFont-Bold';
      }

      const pageWidth = doc.page.width - 60; // margins 30 each side
      const primaryColor = '#1a56db';
      const headerBg = '#1a56db';
      const rowAlt = '#f3f6fb';
      const borderColor = '#d1d5db';
      const textDark = '#111827';
      const textLight = '#ffffff';

      // ─── Title block ──────────────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 60).fill(primaryColor);

      doc
        .fillColor(textLight)
        .font(boldFont)
        .fontSize(18)
        .text(title, 30, 18);

      const dateRange = [
        query.dateFrom ? `From: ${query.dateFrom}` : '',
        query.dateTo ? `To: ${query.dateTo}` : ''
      ]
        .filter(Boolean)
        .join('   ');

      doc
        .fillColor('#bfdbfe')
        .font(regularFont)
        .fontSize(9)
        .text(dateRange || 'All dates', 30, 42);

      doc
        .fillColor('#bfdbfe')
        .text(`Generated: ${new Date().toISOString().slice(0, 10)}`, { align: 'right' });

      // ─── Table header ─────────────────────────────────────────────────────
      const tableTop = 75;
      const rowHeight = 18;
      let startX = 30;

      // Draw header cells
      headers.forEach((header, i) => {
        const w = colWidths[i];
        doc.rect(startX, tableTop, w, rowHeight).fill(headerBg);
        doc
          .fillColor(textLight)
          .font(boldFont)
          .fontSize(7.5)
          .text(header, startX + 3, tableTop + 5, { width: w - 6, ellipsis: true });
        startX += w;
      });

      // ─── Table rows ───────────────────────────────────────────────────────
      rows.forEach((row, rowIdx) => {
        const y = tableTop + rowHeight + rowIdx * rowHeight;

        // Alternate row background
        if (rowIdx % 2 === 1) {
          doc.rect(30, y, pageWidth, rowHeight).fill(rowAlt);
        }

        // Row border bottom
        doc.moveTo(30, y + rowHeight).lineTo(30 + pageWidth, y + rowHeight)
          .strokeColor(borderColor).lineWidth(0.5).stroke();

        let x = 30;
        row.forEach((cell, colIdx) => {
          doc
            .fillColor(textDark)
            .font(regularFont)
            .fontSize(7.5)
            .text(cell, x + 3, y + 5, {
              width: colWidths[colIdx] - 6,
              ellipsis: true
            });
          x += colWidths[colIdx];
        });

        // Auto page break
        if (y + rowHeight * 2 > doc.page.height - 40) {
          doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
          // Redraw header on new page
          let hx = 30;
          headers.forEach((header, i) => {
            const w = colWidths[i];
            doc.rect(hx, 30, w, rowHeight).fill(headerBg);
            doc
              .fillColor(textLight)
              .font(boldFont)
              .fontSize(7.5)
              .text(header, hx + 3, 35, { width: w - 6, ellipsis: true });
            hx += w;
          });
        }
      });

      // ─── Summary footer ───────────────────────────────────────────────────
      const footerY = doc.page.height - 30;
      doc
        .fillColor('#6b7280')
        .font(regularFont)
        .fontSize(8)
        .text(`Total records: ${rows.length}`, 30, footerY)
        .text('Investment Portfolio Management System', 0, footerY, {
          align: 'right',
          width: doc.page.width - 30
        });

      doc.end();
    });
  }

  // ─── Shared Helpers ──────────────────────────────────────────────────────────

  private async ensurePortfolioOwnership(
    userId: string,
    portfolioId?: string
  ): Promise<void> {
    if (!portfolioId) return;

    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      select: { id: true }
    });

    if (!portfolio) {
      throw new NotFoundException('Specified portfolio not found (ไม่พบพอร์ตการลงทุนที่ระบุ)');
    }
  }

  private validateDateRange(query: ReportQueryDto): void {
    if (
      query.dateFrom &&
      query.dateTo &&
      new Date(query.dateFrom) > new Date(query.dateTo)
    ) {
      throw new BadRequestException('dateFrom must not be greater than dateTo (dateFrom ต้องไม่มากกว่า dateTo)');
    }
  }

  private toDateFilter(
    field: 'investmentDate' | 'transactionDate',
    query: ReportQueryDto
  ): Record<string, { gte?: Date; lte?: Date }> {
    if (!query.dateFrom && !query.dateTo) return {};

    return {
      [field]: {
        ...(query.dateFrom ? { gte: this.startOfUtcDay(query.dateFrom) } : {}),
        ...(query.dateTo ? { lte: this.endOfUtcDay(query.dateTo) } : {})
      }
    };
  }

  private startOfUtcDay(value: string): Date {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  private endOfUtcDay(value: string): Date {
    const date = new Date(value);
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }

  private toCsvReport(
    prefix: string,
    headers: string[],
    rows: string[][]
  ): FileReport {
    const content = [headers, ...rows]
      .map((row) => row.map((value) => this.escapeCsv(value)).join(','))
      .join('\r\n');

    return {
      filename: `${prefix}-${this.toFilenameTimestamp()}.csv`,
      content: Buffer.from(`\ufeff${content}`, 'utf8')
    };
  }

  private escapeCsv(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }

  private toNumberString(value: number, maximumFractionDigits = 2): string {
    return value.toFixed(maximumFractionDigits);
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private toFilenameTimestamp(): string {
    return new Date()
      .toISOString()
      .replaceAll(':', '-')
      .replace(/\.\d{3}Z$/, 'Z');
  }
}
