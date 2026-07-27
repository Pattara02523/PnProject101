import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get summary statistics for dashboard (ดึงสถิติสรุปสำหรับหน้าแดชบอร์ด)' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getDashboard(
    @CurrentUser('sub') userId: string
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(userId);
  }
}
