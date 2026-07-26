import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { validate } from './config/env.validation';
import { DatabaseModule } from '@/database/database.module';
import { HashModule } from '@/infrastructure/hash/hash.module';
import { JwtInfraModule } from '@/infrastructure/jwt/jwt.module';
import { AccessTokenGuard } from '@/auth/guards/access-token.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CategoryModule } from './category/category.module';
import { InvestmentModule } from './investment/investment.module';
import { TransactionModule } from './transaction/transaction.module';
import { GoalModule } from './goal/goal.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notification/notification.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { ReportModule } from './report/report.module';
import { AdminModule } from './admin/admin.module';

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
    GoalModule,
    DashboardModule,
    NotificationModule,
    AnnouncementModule,
    ReportModule,
    AdminModule
  ],
  providers: [
    // 1. AccessTokenGuard: ทำงานก่อน — ตรวจว่า JWT Token ถูกต้องไหม
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    // 2. RolesGuard: ทำงานหลัง — ตรวจว่า Role ของผู้ใช้มีสิทธิ์เข้า Endpoint นั้นไหม
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
