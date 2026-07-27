import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalStatus } from '@/database/generated/prisma/enums';
import { Goal } from '@/database/generated/prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * สร้างเป้าหมายทางการเงินใหม่
   */
  async create(userId: string, dto: CreateGoalDto): Promise<GoalResponseDto> {
    const currentAmount = dto.currentAmount ?? 0;
    const targetAmount = dto.targetAmount;
    const deadlineDate = new Date(dto.deadline);
    const now = new Date();

    // ประเมินสถานะเริ่มต้นอัตโนมัติ
    let status: GoalStatus = GoalStatus.IN_PROGRESS;
    if (currentAmount >= targetAmount) {
      status = GoalStatus.COMPLETED;
    } else if (deadlineDate < now) {
      status = GoalStatus.FAILED;
    }

    const goal = await this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        targetAmount,
        currentAmount,
        deadline: deadlineDate,
        status
      }
    });

    return this.formatGoalResponse(goal);
  }

  /**
   * ดึงรายการเป้าหมายทั้งหมดของผู้ใช้
   */
  async findAll(userId: string): Promise<GoalResponseDto[]> {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }]
    });

    return goals.map((goal) => this.formatGoalResponse(goal));
  }

  /**
   * ดึงรายละเอียดเป้าหมายเดี่ยวตาม ID
   */
  async findOne(userId: string, id: string): Promise<GoalResponseDto> {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      throw new NotFoundException('Financial goal not found (ไม่พบเป้าหมายทางการเงิน)');
    }

    return this.formatGoalResponse(goal);
  }

  /**
   * แก้ไขเป้าหมาย และคำนวณสถานะ + % ความคืบหน้าใหม่อัตโนมัติ
   */
  async update(
    userId: string,
    id: string,
    dto: UpdateGoalDto
  ): Promise<GoalResponseDto> {
    const existing = await this.findOne(userId, id);

    const targetAmount = dto.targetAmount ?? Number(existing.targetAmount);
    const currentAmount = dto.currentAmount ?? Number(existing.currentAmount);
    const deadlineDate = dto.deadline
      ? new Date(dto.deadline)
      : existing.deadline;
    const now = new Date();

    // คำนวณสถานะใหม่อัตโนมัติ (หากไม่ได้ระบุ status มาตรงๆ)
    let status: GoalStatus = dto.status ?? existing.status;
    if (!dto.status) {
      if (currentAmount >= targetAmount) {
        status = GoalStatus.COMPLETED;
      } else if (deadlineDate < now && currentAmount < targetAmount) {
        status = GoalStatus.FAILED;
      } else {
        status = GoalStatus.IN_PROGRESS;
      }
    }

    const updated = await this.prisma.goal.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.targetAmount !== undefined && {
          targetAmount: dto.targetAmount
        }),
        ...(dto.currentAmount !== undefined && {
          currentAmount: dto.currentAmount
        }),
        ...(dto.deadline && { deadline: deadlineDate }),
        status
      }
    });

    return this.formatGoalResponse(updated);
  }

  /**
   * ลบเป้าหมาย
   */
  async delete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);

    await this.prisma.goal.delete({
      where: { id }
    });
  }

  // ── Helper Function ────────────────────────────────────────────

  /**
   * คำนวณ % ความคืบหน้า (Progress Percentage) และจัดฟอร์แมตข้อมูลส่งออก
   */
  private formatGoalResponse(goal: Goal): GoalResponseDto {
    const target = Number(goal.targetAmount);
    const current = Number(goal.currentAmount);

    // คำนวณ % ความคืบหน้า (ทศนิยม 2 ตำแหน่ง ไม่เกิน 100%)
    const progressPercentage =
      target > 0
        ? Math.min(100, Number(((current / target) * 100).toFixed(2)))
        : 0;

    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      progressPercentage,
      deadline: goal.deadline,
      status: goal.status,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt
    };
  }
}
