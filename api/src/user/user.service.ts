import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

import { BcryptService } from '@/infrastructure/hash/bcrypt.service';

import { PrismaService } from '@/database/prisma.service';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService
  ) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.safeUserSelect()
    });

    if (!user) {
      throw new NotFoundException('User not found (ไม่พบผู้ใช้)');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto
  ): Promise<UserResponseDto> {
    await this.ensureUserExists(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: this.safeUserSelect()
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found (ไม่พบผู้ใช้)');
    }

    const isPasswordMatched = await this.bcryptService.compare(
      dto.oldPassword,
      user.password
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect current password (รหัสผ่านเดิมไม่ถูกต้อง)');
    }

    const hashedPassword = await this.bcryptService.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true }
    });
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      throw new NotFoundException('User not found (ไม่พบผู้ใช้)');
    }
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
