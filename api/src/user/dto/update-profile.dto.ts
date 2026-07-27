import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@/common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Sombat', description: 'Updated First Name' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @ApiPropertyOptional({ example: 'Deejai', description: 'Updated Last Name' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @ApiPropertyOptional({ example: '0812345678', description: 'Updated Phone Number (10 digits)' })
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits (เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก)'
  })
  phone?: string;
}
