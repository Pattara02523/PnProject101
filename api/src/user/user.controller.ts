import { Body, Controller, Get, Patch } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @CurrentUser('sub') userId: string
  ): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Patch('password')
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<MessageResponseDto> {
    await this.userService.changePassword(userId, changePasswordDto);

    return {
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    };
  }
}
