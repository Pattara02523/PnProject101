import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123', description: 'Current Password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123', description: 'New Password (Alphanumeric, min 8 chars)' })
  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
