import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(
    @CurrentUser('sub') userId: string
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(userId);
  }
}
