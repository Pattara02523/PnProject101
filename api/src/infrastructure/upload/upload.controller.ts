import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { CloudinaryService } from './cloudinary.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload avatar image to Cloudinary (อัปโหลดรูปโปรไฟล์)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (.png, .jpg, .jpeg, .webp, max 2MB)'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully to Cloudinary.',
    type: UploadResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size exceeds 2MB.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' })
        ]
      })
    )
    file: Express.Multer.File
  ): Promise<UploadResponseDto> {
    return this.cloudinaryService.uploadAvatar(file);
  }
}
