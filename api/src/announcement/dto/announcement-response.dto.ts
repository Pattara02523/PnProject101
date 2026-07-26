import { AnnouncementType } from '@/database/generated/prisma/enums';

export class AnnouncementResponseDto {
  id: string;

  title: string;

  message: string;

  type: AnnouncementType;

  imageUrl: string | null;

  isPublished: boolean;

  publishedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
