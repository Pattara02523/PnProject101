import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/odgwivn5/image/upload/v1700000000/pnproject/avatars/sample.jpg',
    description: 'Cloudinary Secure Public Image URL'
  })
  url: string;

  @ApiProperty({
    example: 'pnproject/avatars/sample',
    description: 'Cloudinary Public ID'
  })
  publicId: string;
}
