import { NotificationType } from '@/database/generated/prisma/enums';

export class NotificationResponseDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}
