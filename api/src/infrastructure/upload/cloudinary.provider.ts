import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { EnvVariable } from '@/config/env.validation';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvVariable, true>) => {
    return cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME', { infer: true }),
      api_key: configService.get('CLOUDINARY_API_KEY', { infer: true }),
      api_secret: configService.get('CLOUDINARY_API_SECRET', { infer: true })
    });
  }
};
