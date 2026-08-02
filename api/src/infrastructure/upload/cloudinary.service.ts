import { BadRequestException, Injectable } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary
} from 'cloudinary';
import streamifier from 'streamifier';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class CloudinaryService {
  async uploadAvatar(
    file: Express.Multer.File
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException(
        'Please select an image file to upload (กรุณาเลือกไฟล์รูปภาพสำหรับอัปโหลด)'
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'pnproject/avatars',
          resource_type: 'image'
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                `Cloudinary upload failed: ${error?.message || 'Unknown error'}`
              )
            );
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
