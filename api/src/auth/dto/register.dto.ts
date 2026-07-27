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
  @Trim()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits (เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก)'
  })
  phone?: string;
}
