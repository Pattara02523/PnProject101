import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User Email Address' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
