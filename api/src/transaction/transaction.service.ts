import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InvestmentStatus, TransactionType } from '@/database/generated/prisma/enums';
import { TransactionWhereInput } from '@/database/generated/prisma/models';
import { PrismaService } from '@/database/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionQueryDto } from './dto/list-transaction-query.dto';
import {
  TransactionResponseDto,
  PaginatedTransactionResponseDto
} from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * สร้างรายการธุรกรรมใหม่ (ซื้อ/ขาย/ปันผล/ฝาก/ถอน)
   */
  async create(
    userId: string,
    dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    // 1. ตรวจสอบสิทธิ์ความเป็นเจ้าของ: สินทรัพย์นี้ต้องเป็นของผู้ใช้คนนี้จริงผ่านห่วงโซ่ (Investment -> Portfolio -> User)
    await this.verifyInvestmentOwnership(userId, dto.investmentId);

    // 2. ถ้าเป็นธุรกรรม "ขาย" (SELL): ตรวจสอบว่าจำนวนที่ต้องการขาย เกินกว่าจำนวนหุ้นที่มีอยู่ปัจจุบันหรือไม่
    if (dto.type === TransactionType.SELL && dto.quantity) {
      const investment = await this.prisma.investment.findUnique({
        where: { id: dto.investmentId },
        select: { quantity: true }
      });

      if (investment && Number(dto.quantity) > Number(investment.quantity)) {
        throw new BadRequestException(
          `ไม่สามารถขายได้ ${dto.quantity} หน่วย เนื่องจากปัจจุบันถือครองอยู่เพียง ${investment.quantity} หน่วย`
        );
      }
    }

    // 3. บันทึกข้อมูลธุรกรรมลงในฐานข้อมูล
    const transaction = await this.prisma.transaction.create({
      data: {
        ...dto,
        transactionDate: new Date(dto.transactionDate)
      }
    });

    // 4. คำนวณจำนวนหุ้นคงเหลือ, ต้นทุนเฉลี่ย (Average Cost Policy) และสถานะของ Investment ใหม่ให้อัตโนมัติ
    await this.recalculateInvestmentSummary(dto.investmentId);

    return transaction;
  }

  /**
   * ดึงรายการธุรกรรมทั้งหมดของผู้ใช้ พร้อมระบบค้นหา กรอง และ Pagination
   */
  async findAll(
    userId: string,
    query: ListTransactionQueryDto
  ): Promise<PaginatedTransactionResponseDto> {
    const {
      page = 1,
      limit = 10,
      investmentId,
      type,
      dateFrom,
      dateTo
    } = query;

    const skip = (page - 1) * limit;

    // กรองเอาเฉพาะ Transaction ของ Investment ที่เป็นของผู้ใช้คนนี้เท่านั้น
    const where: TransactionWhereInput = {
      investment: {
        portfolio: { userId }
      },
      ...(investmentId && { investmentId }),
      ...(type && { type }),
      ...(dateFrom || dateTo
        ? {
            transactionDate: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) })
            }
          }
        : {})
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' }
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * ดึงรายละเอียดธุรกรรมเดี่ยวตาม ID
   */
  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: { userId }
        }
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    return transaction;
  }

  /**
   * แก้ไขข้อมูลธุรกรรม
   */
  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    const existing = await this.findOne(userId, id);

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.transactionDate && {
          transactionDate: new Date(dto.transactionDate)
        })
      }
    });

    // คำนวณต้นทุนเฉลี่ยและจำนวนคงเหลือใหม่ทั้งหมดย้อนหลังให้อัตโนมัติเมื่อมีการแก้ไขข้อมูล
    await this.recalculateInvestmentSummary(existing.investmentId);

    return updated;
  }

  /**
   * ลบรายการธุรกรรม
   */
  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.findOne(userId, id);

    await this.prisma.transaction.delete({ where: { id } });

    // คำนวณต้นทุนเฉลี่ยและจำนวนคงเหลือใหม่ทั้งหมดย้อนหลังให้อัตโนมัติเมื่อมีการลบข้อมูล
    await this.recalculateInvestmentSummary(existing.investmentId);
  }

  // ── Private helpers ────────────────────────────────────────────

  /**
   * ตรวจสอบสิทธิ์ว่า Investment นี้เป็นของผู้ใช้จริงหรือไม่
   */
  private async verifyInvestmentOwnership(
    userId: string,
    investmentId: string
  ): Promise<void> {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id: investmentId,
        portfolio: { userId }
      },
      select: { id: true }
    });

    if (!investment) {
      throw new NotFoundException('Investment not found.');
    }
  }

  /**
   * 💡 Average Cost Policy Engine
   * ฟังก์ชั่นคำนวณจำนวนหุ้นคงเหลือ (quantity), ราคาต้นทุนเฉลี่ยถ่วงน้ำหนัก (Weighted Average Cost),
   * และสถานะของสินทรัพย์ (ACTIVE/SOLD) ให้อัตโนมัติจากประวัติการทำรายการย้อนหลังทั้งหมดตามลำดับเวลา
   */
  private async recalculateInvestmentSummary(
    investmentId: string
  ): Promise<void> {
    // ดึงรายการ Transaction ทั้งหมดของสินทรัพย์นี้ เรียงตามวันที่ทำรายการ (เก่า -> ใหม่)
    const transactions = await this.prisma.transaction.findMany({
      where: { investmentId },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }]
    });

    let totalQuantity = 0;   // จำนวนหุ้นคงเหลือสะสม
    let currentAvgCost = 0;  // ราคาต้นทุนเฉลี่ยต่อหุ้นปัจจุบัน

    for (const tx of transactions) {
      const qty = tx.quantity ? Number(tx.quantity) : 0;
      const price = tx.price ? Number(tx.price) : 0;

      if (tx.type === TransactionType.BUY) {
        // --- กรณีซื้อเพิ่ม (BUY) ---
        // 1. คำนวณมูลค่าเงินต้นทุนเดิมก่อนซื้อเพิ่ม = (จำนวนหุ้นเดิม * ราคาเฉลี่ยเดิม)
        const totalCostBefore = totalQuantity * currentAvgCost;
        
        // 2. คำนวณเงินซื้อเพิ่มรอบนี้ = (จำนวนหุ้นซื้อเพิ่ม * ราคาที่ซื้อรอบนี้)
        const buyCost = qty * price;
        
        // 3. บวกจำนวนหุ้นเพิ่มเข้าไปในยอดรวม
        totalQuantity += qty;
        
        // 4. คำนวณราคาเฉลี่ยต่อหน่วยใหม่แบบ Weighted Average Cost = (ต้นทุนเดิมรวม + ต้นทุนใหม่) / จำนวนหุ้นรวมทั้งหมด
        currentAvgCost = totalQuantity > 0 ? (totalCostBefore + buyCost) / totalQuantity : 0;

      } else if (tx.type === TransactionType.SELL) {
        // --- กรณีขายออก (SELL) ---
        // 1. หักจำนวนหุ้นที่ขายอยู่ออก (ป้องกันไม่ให้ติดลบด้วย Math.max)
        totalQuantity = Math.max(0, totalQuantity - qty);
        
        // 2. ถ้าขายจนหุ้นหมดตูด (0 หุ้น) -> รีเซ็ตราคาเฉลี่ยเป็น 0
        if (totalQuantity === 0) {
          currentAvgCost = 0;
        }
        // *หมายเหตุ: การขายออกจะไม่เปลี่ยนราคาต้นทุนเฉลี่ยต่อหน่วยของหุ้นส่วนที่เหลืออยู่ (ตามหลักบัญชี Weighted Average Cost)
      }
    }

    // กำหนดสถานะสินทรัพย์: ถ้าเหลือหุ้น > 0 ให้เป็น ACTIVE, ถ้าหุ้นหมดแล้ว (0) ให้เป็น SOLD
    const status =
      totalQuantity > 0 ? InvestmentStatus.ACTIVE : InvestmentStatus.SOLD;

    // อัปเดตตัวเลขคำนวณจริงล่าสุดกลับไปบันทึกที่ตาราง Investment
    await this.prisma.investment.update({
      where: { id: investmentId },
      data: {
        quantity: totalQuantity,
        averageCost: currentAvgCost,
        status
      }
    });
  }
}
