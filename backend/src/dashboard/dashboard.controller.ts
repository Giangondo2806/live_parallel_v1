import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  DashboardFiltersDto, 
  DashboardDataDto, 
  PaginationDto,
  RecentActivityDto,
  DepartmentStatDto 
} from './dto';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data')
  @ApiOperation({ summary: 'Get complete dashboard data' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Dashboard data retrieved successfully',
    type: DashboardDataDto 
  })
  async getDashboardData(
    @Query() filters: DashboardFiltersDto
  ): Promise<DashboardDataDto> {
    // Delegate all logic to service layer
    return await this.dashboardService.getDashboardData(filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get dashboard statistics only' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Statistics retrieved successfully' 
  })
  async getStatistics(
    @Query() filters: DashboardFiltersDto
  ) {
    // Service handles role-based filtering logic
    return await this.dashboardService.getStatistics(filters);
  }

  @Get('department-stats')
  @ApiOperation({ summary: 'Get statistics by department' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Department statistics retrieved successfully',
    type: [DepartmentStatDto] 
  })
  async getDepartmentStats(
    @Query() filters: DashboardFiltersDto
  ): Promise<DepartmentStatDto[]> {
    // Service handles department-specific filtering
    return await this.dashboardService.getDepartmentStats(filters);
  }

  @Get('recent-activities')
  @ApiOperation({ summary: 'Get recent activities and updates' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Recent activities retrieved successfully',
    type: [RecentActivityDto] 
  })
  async getRecentActivities(
    @Query() pagination: PaginationDto,
    @Query() filters: DashboardFiltersDto
  ): Promise<RecentActivityDto[]> {
    // Service handles pagination and filtering logic
    return await this.dashboardService.getRecentActivities(pagination, filters);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh dashboard data cache' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Dashboard data refreshed successfully' 
  })
  async refreshDashboard(): Promise<{ message: string; timestamp: Date }> {
    // Service handles cache refresh logic
    return await this.dashboardService.refreshDashboardCache();
  }
}
