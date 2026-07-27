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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserRole } from '@/database/generated/prisma/enums';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // เฉพาะผู้ดูแลระบบเท่านั้นที่สร้างการแจ้งเตือนให้ผู้ใช้ได้
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() dto: CreateNotificationDto
  ): Promise<NotificationResponseDto> {
    return this.notificationService.create(dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findAll(userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<NotificationResponseDto> {
    return this.notificationService.markAsRead(userId, id);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.notificationService.delete(userId, id);
    return { message: 'Notification deleted successfully (ลบการแจ้งเตือนสำเร็จ)' };
  }
}
