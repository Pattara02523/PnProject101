import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EnvVariable } from '@/config/env.validation';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariable, true>) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET', { infer: true }),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN', {
            infer: true
          })
        }
      })
    })
  ],
  exports: [JwtModule]
})
export class JwtInfraModule {}
