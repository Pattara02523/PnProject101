import { AssetType, TransactionType } from '@/database/generated/prisma/enums';

export class DashboardSummaryDto {
  totalPortfolioValue: number; // มูลค่าพอร์ตรวม ณ ราคาปัจจุบัน
  totalInvestmentAmount: number; // เงินลงทุนรวม (ต้นทุนทั้งหมด)
  totalProfitLoss: number; // กำไร/ขาดทุนสุทธิ (บาท)
  totalRoiPercentage: number; // % ผลตอบแทนรวม (ROI)
  totalAssetsCount: number; // จำนวนรายการสินทรัพย์ที่มี
  totalPortfoliosCount: number; // จำนวนพอร์ตการลงทุนทั้งหมด
}

export class AssetAllocationDto {
  assetType: AssetType; // ประเภทสินทรัพย์ (STOCK, CRYPTO, etc.)
  totalValue: number; // มูลค่ารวมของประเภทนี้
  percentage: number; // คิดเป็น % ของพอร์ตรวมทั้งหมด
}

export class GoalSummaryDto {
  totalGoals: number; // จำนวนเป้าหมายทั้งหมด
  completedGoals: number; // เป้าหมายที่สำเร็จแล้ว
  inProgressGoals: number; // เป้าหมายที่กำลังสะสมอยู่
  failedGoals: number; // เป้าหมายที่หมดเวลาแต่ไม่สำเร็จ
  averageProgressPercentage: number; // % ความคืบหน้าเฉลี่ยทุกเป้าหมาย
}

export class RecentTransactionDto {
  id: string;
  assetName: string;
  symbol: string;
  type: TransactionType;
  amount: number;
  transactionDate: Date;
}

export class DashboardResponseDto {
  summary: DashboardSummaryDto;
  assetAllocation: AssetAllocationDto[];
  goals: GoalSummaryDto;
  recentTransactions: RecentTransactionDto[];
}
