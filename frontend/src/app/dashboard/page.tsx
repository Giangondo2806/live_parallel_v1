'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi } from '../../lib/api';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box className="flex justify-center items-center min-h-96">
          <Typography className="text-gray-600">Đang tải...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom className="text-gray-700 mb-6">
        Dashboard
      </Typography>

      <Box className="space-y-6">
        {/* Statistics Cards */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="argon-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Idle Resource
              </Typography>
              <Typography variant="h4">
                {dashboardData?.totalIdle || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card className="argon-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cần xử lý gấp
              </Typography>
              <Typography variant="h4" color="warning.main">
                {dashboardData?.urgentCount || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card className="argon-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Phòng ban
              </Typography>
              <Typography variant="h4">
                {dashboardData?.departmentStats?.length || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card className="argon-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cập nhật gần đây
              </Typography>
              <Typography variant="h4">
                {dashboardData?.recentUpdates?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box className="w-full">
          <Card className="argon-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box className="flex gap-4 flex-wrap">
                <Button 
                  variant="contained" 
                  className="argon-button-gradient"
                  onClick={() => router.push('/resources')}
                >
                  Quản lý Idle Resources
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => router.push('/users')}
                >
                  Quản lý người dùng
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => router.push('/history')}
                >
                  Lịch sử cập nhật
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
