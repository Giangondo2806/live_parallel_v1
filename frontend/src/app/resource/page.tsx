'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IdleResourceListSection } from './components';

export default function ResourcePage() {
  return (
    <DashboardLayout>
      <Box className="p-6 bg-background min-h-screen">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-4" aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard" className="text-gray-600 hover:text-gray-800">
            Dashboard
          </Link>
          <Typography color="textPrimary" className="text-gray-700 font-medium">
            Idle Resource Management
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="text-gray-700 font-bold mb-2">
            Idle Resource Management
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Manage and track idle resources across departments
          </Typography>
        </Box>

        {/* Main Content */}
        <IdleResourceListSection />
      </Box>
    </DashboardLayout>
  );
}
