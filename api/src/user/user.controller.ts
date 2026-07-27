import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile (ดูโปรไฟล์ตัวเอง)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(
    @CurrentUser('sub') userId: string
  ): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile (แก้ไขข้อมูลส่วนตัว)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change user password (เปลี่ยนรหัสผ่าน)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid passwords or constraints.' })
  @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password.' })
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<MessageResponseDto> {
    await this.userService.changePassword(userId, changePasswordDto);

    return {
      message: 'Password changed successfully (เปลี่ยนรหัสผ่านสำเร็จ)'
    };
  }
}
