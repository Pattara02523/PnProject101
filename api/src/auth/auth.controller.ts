import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<MessageResponseDto> {
    await this.authService.register(registerDto);

    return {
      message: 'สมัครสมาชิกสำเร็จ'
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getMe(@CurrentUser('sub') id: string): Promise<UserResponseDto> {
    return this.authService.getMe(id);
  }
}
