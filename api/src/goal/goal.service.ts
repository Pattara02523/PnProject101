import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalStatus, NotificationType, ActivityAction } from '@/database/generated/prisma/enums';
import { Goal } from '@/database/generated/prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateGoalDto): Promise<GoalResponseDto> {
    const currentAmount = dto.currentAmount ?? 0;
    const targetAmount = dto.targetAmount;
    const deadlineDate = new Date(dto.deadline);
    const now = new Date();

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

    await this.checkAndNotifyGoalProgress(
      this.prisma,
      userId,
      goal.id,
      goal.title,
      currentAmount,
      targetAmount
    );

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.CREATE,
        module: 'GOAL',
        entityId: goal.id,
        description: `Created financial goal "${goal.title}"`
      }
    });

    return this.formatGoalResponse(goal);
  }

  async findAll(userId: string): Promise<GoalResponseDto[]> {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }]
    });

    return goals.map((goal) => this.formatGoalResponse(goal));
  }

  async findOne(userId: string, id: string): Promise<GoalResponseDto> {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      throw new NotFoundException('Financial goal not found (ไม่พบเป้าหมายทางการเงิน)');
    }

    return this.formatGoalResponse(goal);
  }

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

    await this.checkAndNotifyGoalProgress(
      this.prisma,
      userId,
      updated.id,
      updated.title,
      Number(updated.currentAmount),
      Number(updated.targetAmount)
    );

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.UPDATE,
        module: 'GOAL',
        entityId: updated.id,
        description: `Updated financial goal "${updated.title}"`
      }
    });

    return this.formatGoalResponse(updated);
  }

  async delete(userId: string, id: string): Promise<void> {
    const goal = await this.findOne(userId, id);

    await this.prisma.goal.delete({
      where: { id }
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.DELETE,
        module: 'GOAL',
        entityId: id,
        description: `Deleted financial goal "${goal.title}"`
      }
    });
  }

  private formatGoalResponse(goal: Goal): GoalResponseDto {
    const target = Number(goal.targetAmount);
    const current = Number(goal.currentAmount);

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

  private async checkAndNotifyGoalProgress(
    prisma: any,
    userId: string,
    goalId: string,
    title: string,
    currentAmount: number,
    targetAmount: number
  ): Promise<void> {
    const progress = targetAmount > 0 ? currentAmount / targetAmount : 0;
    const link = `/goal`;

    if (progress >= 1.0) {
      const existingNoti = await prisma.notification.findFirst({
        where: {
          userId,
          link,
          title: { contains: 'completed' }
        }
      });
      if (!existingNoti) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Goal completed (เป้าหมายสำเร็จแล้ว)',
            message: `Congratulations! Your financial goal "${title}" has been successfully completed! (ยินดีด้วย! เป้าหมายการเงิน "${title}" ของคุณสำเร็จเรียบร้อยแล้ว!)`,
            type: NotificationType.GOAL,
            link
          }
        });
      }
    } else if (progress >= 0.9) {
      const existingNoti = await prisma.notification.findFirst({
        where: {
          userId,
          link,
          title: { contains: 'near completion' }
        }
      });
      if (!existingNoti) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Goal near completion (เป้าหมายใกล้สำเร็จ)',
            message: `Your financial goal "${title}" is ${Math.round(progress * 100)}% complete! (เป้าหมายการเงิน "${title}" ของคุณสำเร็จไปแล้ว ${Math.round(progress * 100)}%!)`,
            type: NotificationType.GOAL,
            link
          }
        });
      }
    }
  }
}
