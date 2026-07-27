import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@/common/decorators/trim.decorator';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Sombat', description: 'User First Name' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Deejai', description: 'User Last Name' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'user@example.com', description: 'User Email' })
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Password (Alphanumeric, min 8 chars)' })
  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: '0812345678', description: 'User Phone Number (10 digits)' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits (เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก)'
  })
  phone?: string;
}
