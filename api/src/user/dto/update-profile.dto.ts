import { Trim } from '@/common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก'
  })
  phone?: string;
}
