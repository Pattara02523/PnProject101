import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  InvestmentStatus,
  UserStatus
} from '@/database/generated/prisma/enums';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ListActivityLogsQueryDto } from './dto/list-activity-logs-query.dto';
import {
  AdminUserResponseDto,
  PaginatedAdminUserResponseDto
} from './dto/admin-user-response.dto';
import {
  AdminActivityLogResponseDto,
  PaginatedActivityLogResponseDto
} from './dto/admin-activity-log-response.dto';
import { AdminDashboardResponseDto } from './dto/admin-dashboard-response.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Dashboard ───────────────────────────────────────────────────────────────

  async getDashboard(): Promise<AdminDashboardResponseDto> {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalPortfolios,
      totalInvestments,
      activeInvestments,
      soldInvestments,
      totalTransactions,
      totalAnnouncements,
      publishedAnnouncements
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
      this.prisma.portfolio.count(),
      this.prisma.investment.count(),
      this.prisma.investment.count({ where: { status: InvestmentStatus.ACTIVE } }),
      this.prisma.investment.count({ where: { status: InvestmentStatus.SOLD } }),
      this.prisma.transaction.count(),
      this.prisma.announcement.count(),
      this.prisma.announcement.count({ where: { isPublished: true } })
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers
      },
      portfolios: { total: totalPortfolios },
      investments: {
        total: totalInvestments,
        active: activeInvestments,
        sold: soldInvestments
      },
      transactions: { total: totalTransactions },
      announcements: {
        total: totalAnnouncements,
        published: publishedAnnouncements
      }
    };
  }

  // ─── User Management ─────────────────────────────────────────────────────────

  async findAllUsers(
    query: ListUsersQueryDto
  ): Promise<PaginatedAdminUserResponseDto> {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstname: { contains: search, mode: 'insensitive' as const } },
          { lastname: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    };

    const select = this.safeUserSelect();
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data: data as AdminUserResponseDto[],
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async findOneUser(id: string): Promise<AdminUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeUserSelect()
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user as AdminUserResponseDto;
  }

  async updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto
  ): Promise<AdminUserResponseDto> {
    await this.findOneUser(id);

    return this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
      select: this.safeUserSelect()
    }) as Promise<AdminUserResponseDto>;
  }

  async deleteUser(id: string): Promise<void> {
    await this.findOneUser(id);

    await this.prisma.user.delete({ where: { id } });
  }

  // ─── Activity Logs ───────────────────────────────────────────────────────────

  async findAllActivityLogs(
    query: ListActivityLogsQueryDto
  ): Promise<PaginatedActivityLogResponseDto> {
    const { page = 1, limit = 20, userId, action, module } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(module && { module: { contains: module, mode: 'insensitive' as const } })
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.activityLog.count({ where })
    ]);

    return {
      data: data as AdminActivityLogResponseDto[],
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  private safeUserSelect() {
    return {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    };
  }
}
