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
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserRole } from '@/database/generated/prisma/enums';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto } from './dto/announcement-response.dto';
import { AnnouncementService } from './announcement.service';

@ApiTags('Announcements')
@Controller()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  // ----------------------------------------------------
  // Endpoint สำหรับผู้ใช้ทั่วไป
  // ----------------------------------------------------

  @Public()
  @Get('announcements')
  @ApiOperation({ summary: 'List all published announcements (ดูประกาศสาธารณะทั้งหมด)' })
  @ApiResponse({ status: 200, description: 'List of announcements returned.' })
  async findAllPublished(): Promise<AnnouncementResponseDto[]> {
    return this.announcementService.findAllPublished();
  }

  @Public()
  @Get('announcements/:id')
  @ApiOperation({ summary: 'Get details of a public announcement (ดูประกาศสาธารณะเดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Announcement details returned.' })
  @ApiResponse({ status: 404, description: 'Announcement not found or not published.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.findOne(id);
  }

  // ----------------------------------------------------
  // Endpoint สำหรับผู้ดูแลระบบ
  // ----------------------------------------------------

  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get('admin/announcements')
  @ApiOperation({ summary: 'Admin: List all announcements (ผู้ดูแลดูประกาศทั้งหมด)' })
  @ApiResponse({ status: 200, description: 'List of all announcements returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async findAllForAdmin(): Promise<AnnouncementResponseDto[]> {
    return this.announcementService.findAllForAdmin();
  }

  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post('admin/announcements')
  @ApiOperation({ summary: 'Admin: Create a new announcement (ผู้ดูแลสร้างประกาศใหม่)' })
  @ApiResponse({ status: 201, description: 'Announcement created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  async create(
    @Body() dto: CreateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Patch('admin/announcements/:id')
  @ApiOperation({ summary: 'Admin: Update an announcement (ผู้ดูแลแก้ไขประกาศ)' })
  @ApiResponse({ status: 200, description: 'Announcement updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete('admin/announcements/:id')
  @ApiOperation({ summary: 'Admin: Delete an announcement (ผู้ดูแลลบประกาศ)' })
  @ApiResponse({ status: 200, description: 'Announcement deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin role required).' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.announcementService.delete(id);
    return { message: 'Announcement deleted successfully (ลบประกาศสำเร็จ)' };
  }
}
