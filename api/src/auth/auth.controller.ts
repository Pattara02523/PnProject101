import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user (สมัครสมาชิกใหม่)' })
  @ApiResponse({ status: 201, description: 'Registration successful.' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<MessageResponseDto> {
    await this.authService.register(registerDto);

    return {
      message: 'Registration successful (สมัครสมาชิกสำเร็จ)'
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user (เข้าสู่ระบบ)' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated, returns access token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or user suspended.' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile (ดูข้อมูลตัวเอง)' })
  @ApiResponse({ status: 200, description: 'Returns active user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@CurrentUser('sub') id: string): Promise<UserResponseDto> {
    return this.authService.getMe(id);
  }
}
