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
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserRole } from '@/database/generated/prisma/enums';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto } from './dto/announcement-response.dto';
import { AnnouncementService } from './announcement.service';

@Controller()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  // ----------------------------------------------------
  // Endpoint สำหรับผู้ใช้ทั่วไป
  // ----------------------------------------------------

  @Public()
  @Get('announcements')
  async findAllPublished(): Promise<AnnouncementResponseDto[]> {
    return this.announcementService.findAllPublished();
  }

  @Public()
  @Get('announcements/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.findOne(id);
  }

  // ----------------------------------------------------
  // Endpoint สำหรับผู้ดูแลระบบ
  // ----------------------------------------------------

  @Roles(UserRole.ADMIN)
  @Get('admin/announcements')
  async findAllForAdmin(): Promise<AnnouncementResponseDto[]> {
    return this.announcementService.findAllForAdmin();
  }

  @Roles(UserRole.ADMIN)
  @Post('admin/announcements')
  async create(
    @Body() dto: CreateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch('admin/announcements/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete('admin/announcements/:id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.announcementService.delete(id);
    return { message: 'Announcement deleted successfully (ลบประกาศสำเร็จ)' };
  }
}
