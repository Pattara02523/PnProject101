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
import { CategoryModule } from './category/category.module';
import { InvestmentModule } from './investment/investment.module';
import { TransactionModule } from './transaction/transaction.module';
import { GoalModule } from './goal/goal.module';

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
    PortfolioModule,
    CategoryModule,
    InvestmentModule,
    TransactionModule,
    GoalModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }
  ]
})
export class AppModule {}
