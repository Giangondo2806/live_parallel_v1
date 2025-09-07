'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [router]);

  // Show loading spinner while redirecting
  return (
    <Box
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <Box className="text-center">
        <CircularProgress size={60} className="mb-4" />
        <Typography variant="h6" className="text-gray-600">
          Đang tải hệ thống...
        </Typography>
        <Typography variant="body2" className="text-gray-500 mt-2">
          IRMS - Idle Resource Management System
        </Typography>
      </Box>
    </Box>
  );
}
