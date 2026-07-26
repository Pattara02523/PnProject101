import {
  AssetAllocationDto,
  DashboardResponseDto,
  RecentTransactionDto
} from '@/dashboard/dto/dashboard-response.dto';
import { AssetType, InvestmentStatus } from '@/database/generated/prisma/enums';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ดึงและคำนวณข้อมูลสรุปทางการเงินทั้งหมดของผู้ใช้สำหรับหน้า Dashboard
   */
  async getDashboard(userId: string): Promise<DashboardResponseDto> {
    //1. ดึงจำนวนพอร์ตทั้งหมดของผู้ใช้
    const totalPortfoliosCount = await this.prisma.portfolio.count({
      where: { userId }
    });

    // 2. ดึงรายการสินทรัพย์ที่ยังถือครองอยู่ (status: ACTIVE) ทั้งหมดของผู้ใช้
    const activeInvestments = await this.prisma.investment.findMany({
      where: {
        portfolio: { userId },
        status: InvestmentStatus.ACTIVE
      }
    });

    // 3. คำนวณสรุปตัวเลขทางการเงิน (Summary Cards)
    let totalPortfolioValue = 0;
    let totalInvestmentAmount = 0;
    const allocationMap = new Map<string, number>();
    for (const inv of activeInvestments) {
      const qty = Number(inv.quantity);
      const currentPrice = Number(inv.currentPrice);
      const avgCost = Number(inv.averageCost);
      const currentValue = qty * currentPrice; // มูลค่า ณ ราคาปัจจุบัน
      const costValue = qty * avgCost; // เงินต้นทุนทั้งหมด
      totalPortfolioValue += currentValue;
      totalInvestmentAmount += costValue;

      // จัดกลุ่มมูลค่าตามประเภทสินทรัพย์ (Asset Allocation)
      const currentAssetTypeValue = allocationMap.get(inv.assetType) || 0;
      allocationMap.set(inv.assetType, currentAssetTypeValue + currentValue);
    }
    const totalProfitLoss = Number(
      (totalPortfolioValue - totalInvestmentAmount).toFixed(2)
    );
    const totalRoiPercentage =
      totalInvestmentAmount > 0
        ? Number(((totalProfitLoss / totalInvestmentAmount) * 100).toFixed(2))
        : 0;

    // 4. สรุปสัดส่วนการลงทุน (Asset Allocation Array)
    const assetAllocation: AssetAllocationDto[] = Array.from(
      allocationMap.entries()
    ).map(([assetType, totalValue]) => {
      const percentage =
        totalPortfolioValue > 0
          ? Number(((totalValue / totalPortfolioValue) * 100).toFixed(2))
          : 0;
      return {
        assetType: assetType as AssetType,
        totalValue: Number(totalValue.toFixed(2)),
        percentage
      };
    });

    // 5. ดึงและคำนวณสรุปเป้าหมายการเงิน (Goals Summary)
    const goals = await this.prisma.goal.findMany({
      where: { userId }
    });
    const totalGoals = goals.length;
    let completedGoals = 0;
    let inProgressGoals = 0;
    let failedGoals = 0;
    let sumProgress = 0;
    for (const goal of goals) {
      if (goal.status === 'COMPLETED') completedGoals++;
      else if (goal.status === 'IN_PROGRESS') inProgressGoals++;
      else if (goal.status === 'FAILED') failedGoals++;
      const target = Number(goal.targetAmount);
      const current = Number(goal.currentAmount);
      const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
      sumProgress += progress;
    }
    const averageProgressPercentage =
      totalGoals > 0 ? Number((sumProgress / totalGoals).toFixed(2)) : 0;

    // 6. ดึงธุรกรรมล่าสุด 5 รายการ (Recent Transactions)
    const recentTxList = await this.prisma.transaction.findMany({
      where: {
        investment: {
          portfolio: { userId }
        }
      },
      orderBy: { transactionDate: 'desc' },
      take: 5,
      include: {
        investment: {
          select: {
            assetName: true,
            symbol: true
          }
        }
      }
    });
    const recentTransactions: RecentTransactionDto[] = recentTxList.map(
      (tx) => ({
        id: tx.id,
        assetName: tx.investment.assetName,
        symbol: tx.investment.symbol,
        type: tx.type,
        amount: Number(tx.amount),
        transactionDate: tx.transactionDate
      })
    );
    // 7. รวมข้อมูลตอบกลับทั้งหมด
    return {
      summary: {
        totalPortfolioValue: Number(totalPortfolioValue.toFixed(2)),
        totalInvestmentAmount: Number(totalInvestmentAmount.toFixed(2)),
        totalProfitLoss,
        totalRoiPercentage,
        totalAssetsCount: activeInvestments.length,
        totalPortfoliosCount
      },
      assetAllocation,
      goals: {
        totalGoals,
        completedGoals,
        inProgressGoals,
        failedGoals,
        averageProgressPercentage
      },
      recentTransactions
    };
  }
}
