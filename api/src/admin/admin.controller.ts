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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Admin Dashboard ───────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin: Get dashboard statistics (ผู้ดูแลดูสถิติแดชบอร์ดรวม)' })
  @ApiResponse({ status: 200, description: 'Admin statistics returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async getDashboard(): Promise<AdminDashboardResponseDto> {
    return this.adminService.getDashboard();
  }

  // ─── User Management ───────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'Admin: List and search users (ผู้ดูแลดูและค้นหารายชื่อผู้ใช้งาน)' })
  @ApiResponse({ status: 200, description: 'Paginated user list returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async findAllUsers(
    @Query() query: ListUsersQueryDto
  ): Promise<PaginatedAdminUserResponseDto> {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Admin: Get user details (ผู้ดูแลดูข้อมูลผู้ใช้งานตาม ID)' })
  @ApiResponse({ status: 200, description: 'User details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AdminUserResponseDto> {
    return this.adminService.findOneUser(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Admin: Update user status (ผู้ดูแลแก้ไขสถานะผู้ใช้งาน)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto
  ): Promise<AdminUserResponseDto> {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Admin: Delete user (ผู้ดูแลลบผู้ใช้งาน)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.adminService.deleteUser(id);
    return { message: 'User deleted successfully (ลบผู้ใช้งานสำเร็จ)' };
  }

  // ─── Activity Logs ─────────────────────────────────────────────────────────

  @Get('activity-logs')
  @ApiOperation({ summary: 'Admin: View activity logs (ผู้ดูแลดูบันทึกกิจกรรมในระบบ)' })
  @ApiResponse({ status: 200, description: 'Paginated activity logs returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async findAllActivityLogs(
    @Query() query: ListActivityLogsQueryDto
  ): Promise<PaginatedActivityLogResponseDto> {
    return this.adminService.findAllActivityLogs(query);
  }
}
