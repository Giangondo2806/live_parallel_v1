'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Business, Warning } from '@mui/icons-material';

interface DepartmentStat {
  departmentId: number;
  departmentName: string;
  idleCount: number;
  totalCount: number;
  idlePercentage: number;
  urgentCount: number;
}

interface DepartmentStatsProps {
  departmentStats: DepartmentStat[];
}

export function DepartmentStats({ departmentStats }: DepartmentStatsProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 40) return 'error';
    if (percentage >= 25) return 'warning';
    return 'primary';
  };

  const sortedDepartments = departmentStats
    .slice()
    .sort((a, b) => b.idlePercentage - a.idlePercentage);

  return (
    <Card className="argon-card">
      <CardHeader
        avatar={<Business className="text-blue-500" />}
        title={
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Department Statistics
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            Idle resources breakdown by department
          </Typography>
        }
      />
      <CardContent className="pt-0">
        <Box className="space-y-4">
          {sortedDepartments.map((dept) => (
            <Box key={dept.departmentId} className="p-4 bg-gray-50 rounded-lg">
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="body1" className="font-medium text-gray-700">
                  {dept.departmentName}
                </Typography>
                <Box className="flex items-center gap-2">
                  {dept.urgentCount > 0 && (
                    <Chip
                      icon={<Warning fontSize="small" />}
                      label={`${dept.urgentCount} urgent`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  <Typography variant="body2" className="font-semibold text-gray-600">
                    {dept.idlePercentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box className="mb-2">
                <LinearProgress
                  variant="determinate"
                  value={dept.idlePercentage}
                  color={getProgressColor(dept.idlePercentage)}
                  className="h-2 rounded-full"
                />
              </Box>
              
              <Box className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {dept.idleCount} idle of {dept.totalCount} total
                </span>
                <span>
                  {dept.totalCount - dept.idleCount} available
                </span>
              </Box>
            </Box>
          ))}
        </Box>

        {departmentStats.length === 0 && (
          <Box className="text-center py-8">
            <Typography variant="body2" color="textSecondary">
              No department data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
