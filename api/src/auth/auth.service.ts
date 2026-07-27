import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BcryptService } from '@/infrastructure/hash/bcrypt.service';

import { ActivityAction, UserStatus } from '@/database/generated/prisma/enums';
import { PrismaService } from '@/database/prisma.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true }
    });

    if (existingUser) {
      throw new ConflictException('Email already in use (อีเมลนี้ถูกใช้งานแล้ว)');
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword
      },
      select: { id: true }
    });

    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: ActivityAction.REGISTER,
        module: 'AUTH',
        description: 'User registration successful'
      }
    });
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        ...this.safeUserSelect(),
        password: true
      }
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid email or password (อีเมลหรือรหัสผ่านไม่ถูกต้อง)');
    }

    const isPasswordMatched = await this.bcryptService.compare(
      dto.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password (อีเมลหรือรหัสผ่านไม่ถูกต้อง)');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: ActivityAction.LOGIN,
        module: 'AUTH',
        description: 'User login successful'
      }
    });

    return {
      access_token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  async getMe(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeUserSelect()
    });

    if (!user) {
      throw new NotFoundException('User not found (ไม่พบผู้ใช้)');
    }

    return user;
  }

  private safeUserSelect() {
    return {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    };
  }
}
