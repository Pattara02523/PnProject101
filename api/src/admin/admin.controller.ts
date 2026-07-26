import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query
} from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserRole } from '@/database/generated/prisma/enums';
import { AdminService } from './admin.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ListActivityLogsQueryDto } from './dto/list-activity-logs-query.dto';
import {
  AdminUserResponseDto,
  PaginatedAdminUserResponseDto
} from './dto/admin-user-response.dto';
import {
  PaginatedActivityLogResponseDto
} from './dto/admin-activity-log-response.dto';
import { AdminDashboardResponseDto } from './dto/admin-dashboard-response.dto';

@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Admin Dashboard ───────────────────────────────────────────────────────

  @Get('dashboard')
  async getDashboard(): Promise<AdminDashboardResponseDto> {
    return this.adminService.getDashboard();
  }

  // ─── User Management ───────────────────────────────────────────────────────

  @Get('users')
  async findAllUsers(
    @Query() query: ListUsersQueryDto
  ): Promise<PaginatedAdminUserResponseDto> {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AdminUserResponseDto> {
    return this.adminService.findOneUser(id);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto
  ): Promise<AdminUserResponseDto> {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Delete('users/:id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.adminService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  // ─── Activity Logs ─────────────────────────────────────────────────────────

  @Get('activity-logs')
  async findAllActivityLogs(
    @Query() query: ListActivityLogsQueryDto
  ): Promise<PaginatedActivityLogResponseDto> {
    return this.adminService.findAllActivityLogs(query);
  }
}
