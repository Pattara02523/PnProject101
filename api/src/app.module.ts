import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { validate } from './config/env.validation';
import { DatabaseModule } from '@/database/database.module';
import { HashModule } from '@/infrastructure/hash/hash.module';
import { JwtInfraModule } from '@/infrastructure/jwt/jwt.module';
import { AccessTokenGuard } from '@/auth/guards/access-token.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    DatabaseModule,
    HashModule,
    JwtInfraModule,
    AuthModule,
    UserModule,
    PortfolioModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }
  ]
})
export class AppModule {}
