'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  GetApp as ExportIcon,
  Add as AddIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi } from '../../lib/api';

// Mock data for UI demonstration - BC001 requirement
const MOCK_DASHBOARD_DATA = {
  stats: {
    totalResources: 150,
    totalIdle: 45,
    urgentCount: 12,
    availableCount: 105,
    idlePercentage: 30,
  },
  departmentStats: [
    { departmentId: '1', departmentName: 'IT', totalResources: 50, idleResources: 15, urgentResources: 5, idlePercentage: 30 },
    { departmentId: '2', departmentName: 'HR', totalResources: 25, idleResources: 8, urgentResources: 3, idlePercentage: 32 },
    { departmentId: '3', departmentName: 'Marketing', totalResources: 30, idleResources: 10, urgentResources: 2, idlePercentage: 33 },
    { departmentId: '4', departmentName: 'Sales', totalResources: 45, idleResources: 12, urgentResources: 2, idlePercentage: 27 },
  ],
  recentActivities: [
    {
      id: '1',
      resourceName: 'Nguyen Van A',
      activityType: 'STATUS_UPDATE',
      description: 'Updated status to "Available"',
      performedBy: 'Admin User',
      timestamp: '2024-01-15T10:30:00Z',
      departmentName: 'IT',
    },
    {
      id: '2',
      resourceName: 'Tran Thi B',
      activityType: 'RESOURCE_ADDED',
      description: 'Added to Idle Pool',
      performedBy: 'RA User',
      timestamp: '2024-01-15T09:15:00Z',
      departmentName: 'HR',
    },
    {
      id: '3',
      resourceName: 'Le Van C',
      activityType: 'CV_UPDATED',
      description: 'CV file updated',
      performedBy: 'Resource Assistant',
      timestamp: '2024-01-15T08:45:00Z',
      departmentName: 'Marketing',
    },
    {
      id: '4',
      resourceName: 'Pham Thi D',
      activityType: 'RESOURCE_ASSIGNED',
      description: 'Assigned to new project',
      performedBy: 'Manager',
      timestamp: '2024-01-14T16:20:00Z',
      departmentName: 'IT',
    },
  ],
  quickActions: {
    hasUrgentResources: true,
    suggestedActions: ['Review urgent resources', 'Export department reports', 'Update resource statuses'],
    alertMessages: ['12 resources have been idle for more than 2 months'],
  },
  chartData: {
    idleTrendData: [
      { date: '2024-01-01', count: 40 },
      { date: '2024-01-08', count: 42 },
      { date: '2024-01-15', count: 45 },
    ],
    departmentDistribution: [
      { department: 'IT', count: 15, percentage: 33.3 },
      { department: 'HR', count: 8, percentage: 17.8 },
      { department: 'Marketing', count: 10, percentage: 22.2 },
      { department: 'Sales', count: 12, percentage: 26.7 },
    ],
    statusDistribution: [
      { status: 'Idle', count: 45, percentage: 30 },
      { status: 'Available', count: 105, percentage: 70 },
    ],
  },
};

interface DashboardFilters {
  departmentId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(MOCK_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    // Use mock data for demonstration - BC001 requirement
    setDashboardData(MOCK_DASHBOARD_DATA);
    setLastRefresh(new Date());
  }, [router]);

  const handleRefreshData = async () => {
    // TODO: Implement real API call to refresh dashboard data
    // TODO: Add error handling for API failures
    // TODO: Add loading states for better UX
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just update the timestamp and refresh mock data
      setDashboardData({ ...MOCK_DASHBOARD_DATA });
      setLastRefresh(new Date());
    } catch (error) {
      setError('Failed to refresh dashboard data');
      console.error('Dashboard refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    // TODO: Implement navigation to relevant screens based on action
    // TODO: Add role-based action availability
    // TODO: Add confirmation dialogs for destructive actions
    
    switch (action) {
      case 'export-reports':
        console.log('Navigating to export reports...');
        // router.push('/reports/export');
        break;
      case 'add-resource':
        console.log('Navigating to add resource...');
        // router.push('/idle-resources/new');
        break;
      case 'import-data':
        console.log('Opening import dialog...');
        // Handle import action
        break;
      case 'view-urgent':
        console.log('Navigating to urgent resources...');
        // router.push('/idle-resources?filter=urgent');
        break;
      default:
        console.log(`Action not implemented: ${action}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'STATUS_UPDATE': return 'primary';
      case 'RESOURCE_ADDED': return 'success';
      case 'CV_UPDATED': return 'info';
      case 'RESOURCE_ASSIGNED': return 'warning';
      default: return 'default';
    }
  };

  if (loading && !dashboardData) {
    return (
      <DashboardLayout>
        <Box className="p-6 space-y-6">
          <Skeleton variant="rectangular" height={200} />
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rectangular" height={120} />
            ))}
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="p-6 space-y-6">
        {/* Header Section */}
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="text-gray-800 font-bold mb-2">
              Dashboard Overview
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Last updated: {lastRefresh.toLocaleString('vi-VN')}
            </Typography>
          </Box>
          <Box className="flex items-center gap-2">
            <IconButton 
              onClick={handleRefreshData} 
              disabled={loading}
              className="hover:bg-gray-100"
            >
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Alert Messages */}
        {dashboardData?.quickActions?.alertMessages?.length > 0 && (
          <Alert severity="warning" className="mb-4">
            <Box>
              {dashboardData.quickActions.alertMessages.map((message: string, index: number) => (
                <Typography key={index} variant="body2">
                  {message}
                </Typography>
              ))}
            </Box>
          </Alert>
        )}

        {/* Statistics Cards */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="argon-card hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="text-blue-600 font-bold">
                    {dashboardData?.stats?.totalResources || 0}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Total Resources
                  </Typography>
                </Box>
                <PeopleIcon className="text-blue-500 text-4xl" />
              </Box>
            </CardContent>
          </Card>

          <Card className="argon-card hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="text-orange-600 font-bold">
                    {dashboardData?.stats?.totalIdle || 0}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Idle Resources
                  </Typography>
                  <Typography variant="caption" className="text-orange-500">
                    {dashboardData?.stats?.idlePercentage || 0}% of total
                  </Typography>
                </Box>
                <TimelineIcon className="text-orange-500 text-4xl" />
              </Box>
            </CardContent>
          </Card>

          <Card className="argon-card hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="text-red-600 font-bold">
                    {dashboardData?.stats?.urgentCount || 0}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Urgent (≥2 months)
                  </Typography>
                  {dashboardData?.stats?.urgentCount > 0 && (
                    <Chip 
                      label="Requires Attention" 
                      color="error" 
                      size="small" 
                      className="mt-1"
                    />
                  )}
                </Box>
                <WarningIcon className="text-red-500 text-4xl" />
              </Box>
            </CardContent>
          </Card>

          <Card className="argon-card hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="text-green-600 font-bold">
                    {dashboardData?.stats?.availableCount || 0}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Available Resources
                  </Typography>
                </Box>
                <TrendingUpIcon className="text-green-500 text-4xl" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Section */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Statistics */}
          <Card className="argon-card h-full">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="text-gray-800 font-semibold">
                  By Department
                </Typography>
                <BusinessIcon className="text-gray-500" />
              </Box>
              <Box className="space-y-3">
                {dashboardData?.departmentStats?.map((dept: any) => (
                  <Box key={dept.departmentId} className="p-3 bg-gray-50 rounded-lg">
                    <Box className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle2" className="font-medium">
                        {dept.departmentName}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        {dept.idlePercentage}% idle
                      </Typography>
                    </Box>
                    <Box className="flex justify-between text-sm text-gray-600">
                      <span>Total: {dept.totalResources}</span>
                      <span>Idle: {dept.idleResources}</span>
                      <span className="text-red-600">Urgent: {dept.urgentResources}</span>
                    </Box>
                    <Box className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <Box 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${dept.idlePercentage}%` }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="argon-card h-full">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="text-gray-800 font-semibold">
                  Recent Updates (Last 7 days)
                </Typography>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => router.push('/history-logs')}
                  className="text-blue-600"
                >
                  View All
                </Button>
              </Box>
              <Box className="space-y-3 max-h-80 overflow-y-auto">
                {dashboardData?.recentActivities?.map((activity: any) => (
                  <Box key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Box className="flex-1">
                      <Box className="flex items-center gap-2 mb-1">
                        <Typography variant="subtitle2" className="font-medium">
                          {activity.resourceName}
                        </Typography>
                        <Chip 
                          label={activity.activityType}
                          color={getActivityTypeColor(activity.activityType) as any}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {activity.description}
                      </Typography>
                      <Box className="flex justify-between text-xs text-gray-500">
                        <span>{activity.departmentName} • {activity.performedBy}</span>
                        <span>{formatDate(activity.timestamp)}</span>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Card className="argon-card">
          <CardContent className="p-4">
            <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
              Quick Actions
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleQuickAction('add-resource')}
                className="argon-button-gradient"
              >
                Add Resource
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => handleQuickAction('import-data')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Import Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={() => handleQuickAction('export-reports')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Export Data
              </Button>
              {dashboardData?.stats?.urgentCount > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<WarningIcon />}
                  onClick={() => handleQuickAction('view-urgent')}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Review Urgent ({dashboardData.stats.urgentCount})
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
