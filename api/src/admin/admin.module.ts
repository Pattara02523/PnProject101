import { Module } from '@nestjs/common';
import { ReportModule } from '@/report/report.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ReportModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
