import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
