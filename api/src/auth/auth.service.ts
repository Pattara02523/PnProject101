import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BcryptService } from '@/infrastructure/hash/bcrypt.service';

import { UserStatus } from '@/database/generated/prisma/enums';
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
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    await this.prisma.user.create({
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword
      },
      select: this.safeUserSelect()
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
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordMatched = await this.bcryptService.compare(
      dto.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role
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
      throw new NotFoundException('User not found.');
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
