'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import { 
  People, 
  Warning, 
  Business, 
  Schedule,
  Refresh,
} from '@mui/icons-material';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { 
  StatisticCard, 
  RecentActivities, 
  DepartmentStats, 
  QuickActions 
} from '../../components/dashboard';
import { dashboardApi } from '../../lib/api';
import { MOCK_DASHBOARD_DATA } from '../../lib/mockData/dashboardData';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setError(null);
      // TODO: Replace with actual API call when backend implements business logic
      // const data = await dashboardApi.getDashboardData();
      
      // Using mock data for UI development
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setDashboardData(MOCK_DASHBOARD_DATA);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Using mock data for demonstration.');
      // Fallback to mock data
      setDashboardData(MOCK_DASHBOARD_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    loadDashboardData();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'import':
        // TODO: Implement import dialog
        console.log('Import Excel functionality - to be implemented');
        break;
      case 'export':
        // TODO: Implement export functionality
        console.log('Export Data functionality - to be implemented');
        break;
      case 'add-resource':
        router.push('/resources/new');
        break;
      case 'refresh':
        handleRefresh();
        break;
      case 'reports':
        router.push('/reports');
        break;
      case 'history':
        router.push('/history');
        break;
      default:
        console.log(`Action ${action} not implemented`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box className="space-y-6">
          <Typography variant="h4" gutterBottom className="text-gray-700 mb-6">
            Dashboard
          </Typography>
          
          {/* Loading Skeletons */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" height={120} className="rounded-xl" />
              </Box>
            ))}
          </Box>
          
          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Box className="lg:col-span-2">
              <Skeleton variant="rectangular" height={400} className="rounded-xl" />
            </Box>
            <Box>
              <Skeleton variant="rectangular" height={400} className="rounded-xl" />
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  const statistics = dashboardData?.statistics;

  return (
    <DashboardLayout>
      <Box className="space-y-6 min-h-full">
        {/* Header */}
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h4" className="text-gray-700 font-bold mb-2">
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back! Here's what's happening with your resources.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Last Updated Info */}
        <Box className="text-right">
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastRefresh.toLocaleString()}
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticCard
            title="Total Idle Resources"
            value={statistics?.totalIdleResources || 0}
            subtitle={`${statistics?.idlePercentage || 0}% of total resources`}
            icon={<People className="text-blue-500" />}
            trend="up"
            trendValue="+5 this week"
            color="primary"
          />
          
          <StatisticCard
            title="Urgent Resources"
            value={statistics?.urgentResources || 0}
            subtitle="Idle ≥ 2 months"
            icon={<Warning className="text-orange-500" />}
            color="warning"
            urgent={true}
            trend="down"
            trendValue="-2 from last month"
          />
          
          <StatisticCard
            title="Available Resources"
            value={statistics?.availableResources || 0}
            subtitle="Ready for assignment"
            icon={<Schedule className="text-green-500" />}
            color="success"
            trend="up"
            trendValue="+12 this month"
          />
          
          <StatisticCard
            title="Departments"
            value={statistics?.departmentsWithIdle || 0}
            subtitle="With idle resources"
            icon={<Business className="text-purple-500" />}
            color="info"
          />
        </Box>

        {/* Main Content */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <RecentActivities 
            activities={dashboardData?.recentActivities || []}
            maxItems={6}
          />
          
          {/* Department Statistics */}
          <DepartmentStats 
            departmentStats={dashboardData?.departmentStats || []}
          />
        </Box>

        {/* Quick Actions */}
        <Box className="w-full">
          <QuickActions
            onImportClick={() => handleQuickAction('import')}
            onExportClick={() => handleQuickAction('export')}
            onAddResourceClick={() => handleQuickAction('add-resource')}
            onRefreshClick={() => handleQuickAction('refresh')}
            onViewReportsClick={() => handleQuickAction('reports')}
            onViewHistoryClick={() => handleQuickAction('history')}
          />
        </Box>

        {/* Additional Info */}
        <Box className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Typography variant="h6" className="text-blue-700 mb-2">
            💡 Pro Tips
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
            <Box>
              • Resources idle ≥ 2 months are marked as urgent
            </Box>
            <Box>
              • Use bulk actions for efficient resource management
            </Box>
            <Box>
              • Department managers see only their department data
            </Box>
            <Box>
              • Export feature supports Excel and CSV formats
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
