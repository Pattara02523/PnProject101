import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@/database/generated/prisma/enums';
import { PrismaService } from '@/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * สร้างการแจ้งเตือนใหม่สำหรับผู้ใช้ (เรียกใช้จากภายในระบบหรือ Admin)
   */
  async create(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type ?? NotificationType.REMINDER
      }
    });
  }

  /**
   * ดึงรายการแจ้งเตือนทั้งหมดของผู้ใช้คนนี้ (เรียงจากใหม่ไปเก่า)
   */
  async findAll(userId: string): Promise<NotificationResponseDto[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * ดึงรายละเอียดการแจ้งเตือนเดี่ยวตาม ID พร้อมตรวจสิทธิ์ ownership
   */
  async findOne(userId: string, id: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found (ไม่พบการแจ้งเตือน)');
    }

    return notification;
  }

  /**
   * กดอ่านการแจ้งเตือน (เปลี่ยนสถานะ isRead เป็น true)
   */
  async markAsRead(
    userId: string,
    id: string
  ): Promise<NotificationResponseDto> {
    await this.findOne(userId, id);

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  /**
   * ลบการแจ้งเตือน
   */
  async delete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);

    await this.prisma.notification.delete({
      where: { id }
    });
  }
}
