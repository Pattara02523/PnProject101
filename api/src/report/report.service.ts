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
    await this.ensureUserExists(userId);
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

    if (investments.length === 0) {
      throw new NotFoundException(
        'No investment data found for this user to export (ไม่พบข้อมูลการลงทุนของผู้ใช้งานท่านนี้เพื่อส่งออก)'
      );
    }

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
    await this.ensureUserExists(userId);
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

    if (transactions.length === 0) {
      throw new NotFoundException(
        'No transaction data found for this user to export (ไม่พบข้อมูลธุรกรรมของผู้ใช้งานท่านนี้เพื่อส่งออก)'
      );
    }

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

  // ─── PDF (Executive Financial Report) ──────────────────────────────────────

  async createPortfolioPdf(
    userId: string,
    query: ReportQueryDto
  ): Promise<FileReport> {
    await this.ensureUserExists(userId);
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

    if (investments.length === 0) {
      throw new NotFoundException(
        'No investment data found for this user to export (ไม่พบข้อมูลการลงทุนของผู้ใช้งานท่านนี้เพื่อส่งออก)'
      );
    }

    const headers = [
      'Asset', 'Portfolio', 'Category', 'Type', 'Qty',
      'Avg Cost', 'Cur Price', 'Cost Val', 'Cur Val', 'P&L', 'ROI%'
    ];
    const colWidths = [110, 85, 85, 50, 55, 65, 65, 70, 70, 70, 55];
    const colAlignments: ('left' | 'right' | 'center')[] = [
      'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right'
    ];

    let totalCost = 0;
    let totalCurVal = 0;

    const rows = investments.map((inv) => {
      const qty = Number(inv.quantity);
      const avg = Number(inv.averageCost);
      const cur = Number(inv.currentPrice);
      const cost = qty * avg;
      const curVal = qty * cur;
      const pl = curVal - cost;
      const roi = cost === 0 ? 0 : (pl / cost) * 100;

      totalCost += cost;
      totalCurVal += curVal;

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
        `${pl >= 0 ? '+' : ''}${this.toNumberString(pl)}`,
        `${roi >= 0 ? '+' : ''}${this.toNumberString(roi)}%`
      ];
    });

    const totalPL = totalCurVal - totalCost;
    const totalROI = totalCost === 0 ? 0 : (totalPL / totalCost) * 100;

    const summaryKpis = [
      { label: 'PORTFOLIO VALUE', value: `THB ${this.toNumberString(totalCurVal)}`, color: '#0f172a' },
      { label: 'TOTAL COST', value: `THB ${this.toNumberString(totalCost)}`, color: '#475569' },
      { label: 'NET PROFIT / LOSS', value: `${totalPL >= 0 ? '+' : ''}THB ${this.toNumberString(totalPL)}`, color: totalPL >= 0 ? '#059669' : '#dc2626' },
      { label: 'OVERALL ROI', value: `${totalROI >= 0 ? '+' : ''}${this.toNumberString(totalROI)}%`, color: totalROI >= 0 ? '#059669' : '#dc2626' }
    ];

    const content = await this.buildPdf(
      'INVESTMENT PORTFOLIO STATEMENT',
      query,
      headers,
      colWidths,
      colAlignments,
      rows,
      summaryKpis
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
    await this.ensureUserExists(userId);
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

    if (transactions.length === 0) {
      throw new NotFoundException(
        'No transaction data found for this user to export (ไม่พบข้อมูลธุรกรรมของผู้ใช้งานท่านนี้เพื่อส่งออก)'
      );
    }

    const headers = ['Portfolio', 'Asset', 'Symbol', 'Type', 'Qty', 'Price', 'Amount', 'Fee', 'Tax', 'Date'];
    const colWidths = [100, 110, 60, 55, 60, 70, 80, 55, 55, 135];
    const colAlignments: ('left' | 'right' | 'center')[] = [
      'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'right', 'center'
    ];

    let totalAmount = 0;
    let totalFee = 0;

    const rows = transactions.map((t) => {
      const amt = Number(t.amount || 0);
      const fee = Number(t.fee || 0);
      totalAmount += amt;
      totalFee += fee;

      return [
        t.investment.portfolio.name,
        t.investment.assetName,
        t.investment.symbol,
        t.type,
        t.quantity ? this.toNumberString(Number(t.quantity), 4) : '-',
        t.price ? this.toNumberString(Number(t.price)) : '-',
        this.toNumberString(amt),
        t.fee ? this.toNumberString(fee) : '-',
        t.tax ? this.toNumberString(Number(t.tax)) : '-',
        this.toDateString(t.transactionDate)
      ];
    });

    const summaryKpis = [
      { label: 'TOTAL TRANSACTIONS', value: `${transactions.length} Records`, color: '#0f172a' },
      { label: 'TOTAL TRANSACTION VALUE', value: `THB ${this.toNumberString(totalAmount)}`, color: '#059669' },
      { label: 'TOTAL FEES PAID', value: `THB ${this.toNumberString(totalFee)}`, color: '#475569' }
    ];

    const content = await this.buildPdf(
      'TRANSACTION HISTORY REPORT',
      query,
      headers,
      colWidths,
      colAlignments,
      rows,
      summaryKpis
    );

    return {
      filename: `transaction-report-${this.toFilenameTimestamp()}.pdf`,
      content
    };
  }

  // ─── Modern PDF Builder ──────────────────────────────────────────────────────

  private buildPdf(
    title: string,
    query: ReportQueryDto,
    headers: string[],
    colWidths: number[],
    colAlignments: ('left' | 'right' | 'center')[],
    rows: string[][],
    summaryKpis?: { label: string; value: string; color: string }[]
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

      const pageWidth = doc.page.width - 60; // margins 30 each side (781.89 pt)
      const brandDark = '#0f172a';
      const brandEmerald = '#059669';
      const headerBg = '#064e3b'; // Dark Emerald
      const rowAlt = '#f8fafc';
      const borderColor = '#e2e8f0';
      const textDark = '#1e293b';

      // Function to render header & KPI cards on page
      const renderHeader = (isFirstPage: boolean) => {
        // Top Emerald Accent Strip
        doc.rect(0, 0, doc.page.width, 4).fill(brandEmerald);

        // Header Dark Banner
        doc.rect(0, 4, doc.page.width, 50).fill(brandDark);

        doc
          .fillColor('#10b981')
          .font(boldFont)
          .fontSize(13)
          .text('INVESTPRO', 30, 14);

        doc
          .fillColor('#94a3b8')
          .font(boldFont)
          .fontSize(8)
          .text(title, 30, 32);

        const dateRange = [
          query.dateFrom ? `From: ${query.dateFrom}` : '',
          query.dateTo ? `To: ${query.dateTo}` : ''
        ]
          .filter(Boolean)
          .join('  |  ');

        doc
          .fillColor('#cbd5e1')
          .font(regularFont)
          .fontSize(8)
          .text(`Date Range: ${dateRange || 'All Period'}`, 400, 16, { width: pageWidth - 370, align: 'right' })
          .text(`Generated: ${new Date().toISOString().slice(0, 10)}`, 400, 30, { width: pageWidth - 370, align: 'right' });

        if (isFirstPage && summaryKpis && summaryKpis.length > 0) {
          const cardY = 62;
          const cardHeight = 44;
          const totalGaps = (summaryKpis.length - 1) * 10;
          const cardWidth = (pageWidth - totalGaps) / summaryKpis.length;

          summaryKpis.forEach((kpi, idx) => {
            const cardX = 30 + idx * (cardWidth + 10);

            // Card background & border
            doc
              .roundedRect(cardX, cardY, cardWidth, cardHeight, 6)
              .fillAndStroke('#f8fafc', '#e2e8f0');

            // KPI Label
            doc
              .fillColor('#64748b')
              .font(boldFont)
              .fontSize(7)
              .text(kpi.label, cardX + 8, cardY + 8, { width: cardWidth - 16 });

            // KPI Value
            doc
              .fillColor(kpi.color)
              .font(boldFont)
              .fontSize(11)
              .text(kpi.value, cardX + 8, cardY + 22, { width: cardWidth - 16 });
          });
        }
      };

      // Render Header on Page 1
      renderHeader(true);

      const tableTop = summaryKpis && summaryKpis.length > 0 ? 116 : 64;
      const rowHeight = 20;

      // Function to render table column headers
      const renderTableHeaders = (startY: number) => {
        let hx = 30;
        headers.forEach((header, i) => {
          const w = colWidths[i];
          const align = colAlignments[i] || 'left';
          doc.rect(hx, startY, w, rowHeight).fill(headerBg);
          doc
            .fillColor('#ffffff')
            .font(boldFont)
            .fontSize(7.5)
            .text(header, hx + 4, startY + 6, {
              width: w - 8,
              align,
              ellipsis: true
            });
          hx += w;
        });
      };

      renderTableHeaders(tableTop);

      let currentY = tableTop + rowHeight;

      // Render Table Rows
      rows.forEach((row, rowIdx) => {
        // Auto Page Break if approaching page bottom
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
          renderHeader(false);
          renderTableHeaders(64);
          currentY = 64 + rowHeight;
        }

        // Alternate row background
        if (rowIdx % 2 === 1) {
          doc.rect(30, currentY, pageWidth, rowHeight).fill(rowAlt);
        }

        // Row bottom border line
        doc
          .moveTo(30, currentY + rowHeight)
          .lineTo(30 + pageWidth, currentY + rowHeight)
          .strokeColor(borderColor)
          .lineWidth(0.5)
          .stroke();

        let x = 30;
        row.forEach((cell, colIdx) => {
          const w = colWidths[colIdx];
          const align = colAlignments[colIdx] || 'left';

          // Color coding for profit / loss cells
          let cellColor = textDark;
          let fontToUse = regularFont;

          if (cell.startsWith('+')) {
            cellColor = '#059669'; // Emerald Green
            fontToUse = boldFont;
          } else if (cell.startsWith('-') && cell !== '-') {
            cellColor = '#dc2626'; // Crimson Red
            fontToUse = boldFont;
          }

          doc
            .fillColor(cellColor)
            .font(fontToUse)
            .fontSize(7.5)
            .text(cell, x + 4, currentY + 6, {
              width: w - 8,
              align,
              ellipsis: true
            });

          x += w;
        });

        currentY += rowHeight;
      });

      // Add Page Numbers & Footer Watermark on all pages
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        const footerY = doc.page.height - 25;

        // Footer Border Line
        doc
          .moveTo(30, footerY - 5)
          .lineTo(doc.page.width - 30, footerY - 5)
          .strokeColor('#cbd5e1')
          .lineWidth(0.5)
          .stroke();

        doc
          .fillColor('#64748b')
          .font(regularFont)
          .fontSize(7.5)
          .text('InvestPro Portfolio Management System • Confidential Financial Statement', 30, footerY)
          .text(`Page ${i + 1} of ${pages.count}`, 0, footerY, {
            align: 'right',
            width: doc.page.width - 30
          });
      }

      doc.end();
    });
  }

  // ─── Shared Helpers ──────────────────────────────────────────────────────────

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      throw new NotFoundException('User not found (ไม่พบผู้ใช้งานในระบบ)');
    }
  }

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
