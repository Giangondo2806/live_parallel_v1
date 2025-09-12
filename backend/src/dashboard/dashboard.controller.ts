import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardDataDto, DashboardFiltersDto } from './dto/dashboard.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data')
  @ApiOperation({ summary: 'Get dashboard statistics and overview data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully', type: DashboardDataDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiQuery({ name: 'departmentId', required: false, type: 'string', description: 'Filter by department ID' })
  @ApiQuery({ name: 'dateFrom', required: false, type: 'string', description: 'Filter from date (ISO format)' })
  @ApiQuery({ name: 'dateTo', required: false, type: 'string', description: 'Filter to date (ISO format)' })
  async getDashboardData(@Query() filters: DashboardFiltersDto): Promise<DashboardDataDto> {
    // TODO: Implement role-based filtering logic
    // TODO: Add caching for performance optimization
    // TODO: Add error handling for data retrieval failures
    return await this.dashboardService.getDashboardData(filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get detailed statistics for dashboard charts' })
  @ApiResponse({ status: 200, description: 'Statistics data retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getStatistics(@Query() filters: DashboardFiltersDto): Promise<any> {
    // TODO: Implement department-wise statistics
    // TODO: Add real-time data aggregation
    // TODO: Add chart data formatting
    return await this.dashboardService.getStatistics(filters);
  }

  @Get('recent-activities')
  @ApiOperation({ summary: 'Get recent activities and updates' })
  @ApiResponse({ status: 200, description: 'Recent activities retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Limit number of activities (default: 10)' })
  async getRecentActivities(@Query() filters: DashboardFiltersDto): Promise<any[]> {
    // TODO: Implement pagination for activities
    // TODO: Add activity type filtering
    // TODO: Add user-specific activity filtering based on role
    return await this.dashboardService.getRecentActivities(filters);
  }

  @Get('department-stats')
  @ApiOperation({ summary: 'Get department-wise resource statistics' })
  @ApiResponse({ status: 200, description: 'Department statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getDepartmentStats(@Query() filters: DashboardFiltersDto): Promise<any[]> {
    // TODO: Implement role-based department access control
    // TODO: Add chart data formatting for department statistics
    // TODO: Add resource status breakdown per department
    return await this.dashboardService.getDepartmentStats(filters);
  }
}
