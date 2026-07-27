import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserRole } from '@/database/generated/prisma/enums';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Admin: Create a new notification (ผู้ดูแลสร้างการแจ้งเตือน)' })
  @ApiResponse({ status: 201, description: 'Notification created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async create(
    @Body() dto: CreateNotificationDto
  ): Promise<NotificationResponseDto> {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user notifications (ดูการแจ้งเตือนทั้งหมดของฉัน)' })
  @ApiResponse({ status: 200, description: 'List of notifications returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findAll(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read (กดอ่านการแจ้งเตือน)' })
  @ApiResponse({ status: 200, description: 'Notification marked as read successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<NotificationResponseDto> {
    return this.notificationService.markAsRead(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification (ลบการแจ้งเตือน)' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.notificationService.delete(userId, id);
    return { message: 'Notification deleted successfully (ลบการแจ้งเตือนสำเร็จ)' };
  }
}
