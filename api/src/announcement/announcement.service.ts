import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto } from './dto/announcement-response.dto';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ดึงรายการประกาศสาธารณะ (เฉพาะที่ isPublished: true) สำหรับ User ทั่วไป
   */
  async findAllPublished(): Promise<AnnouncementResponseDto[]> {
    return this.prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' }
    });
  }

  /**
   * ดึงรายละเอียดประกาศเดี่ยวตาม ID
   */
  async findOne(id: string): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.findFirst({
      where: { id, isPublished: true }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found (ไม่พบประกาศ)');
    }

    return announcement;
  }

  /**
   * ดึงประกาศทั้งหมด (รวมที่ซ่อนไว้) สำหรับ Admin
   */
  async findAllForAdmin(): Promise<AnnouncementResponseDto[]> {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * สร้างประกาศใหม่ (Admin)
   */
  async create(dto: CreateAnnouncementDto): Promise<AnnouncementResponseDto> {
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type,
        imageUrl: dto.imageUrl,
        isPublished: dto.isPublished ?? true
      }
    });
  }

  /**
   * แก้ไขประกาศ (Admin)
   */
  async update(
    id: string,
    dto: UpdateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    await this.findOneForAdmin(id);

    return this.prisma.announcement.update({
      where: { id },
      data: dto
    });
  }

  /**
   * ลบประกาศ (Admin)
   */
  async delete(id: string): Promise<void> {
    await this.findOneForAdmin(id);

    await this.prisma.announcement.delete({
      where: { id }
    });
  }

  // ผู้ดูแลระบบต้องเข้าถึงได้ทั้งประกาศที่เผยแพร่และประกาศฉบับร่าง
  private async findOneForAdmin(id: string): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found (ไม่พบประกาศ)');
    }

    return announcement;
  }
}
