'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  People,
  Business,
  Timer,
} from '@mui/icons-material';

interface StatisticCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'warning' | 'error' | 'success' | 'info';
  urgent?: boolean;
}

export function StatisticCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon,
  color = 'primary',
  urgent = false 
}: StatisticCardProps) {
  const getCardStyle = () => {
    const baseStyle = "argon-card h-full";
    if (urgent) {
      return `${baseStyle} border-l-4 border-warning-main bg-gradient-to-r from-orange-50 to-white`;
    }
    return baseStyle;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" fontSize="small" />;
      case 'down':
        return <TrendingDown className="text-red-500" fontSize="small" />;
      default:
        return null;
    }
  };

  const getIconComponent = () => {
    if (icon) return icon;
    
    switch (color) {
      case 'warning':
        return <Warning className="text-orange-500" />;
      case 'error':
        return <Warning className="text-red-500" />;
      case 'success':
        return <People className="text-green-500" />;
      case 'info':
        return <Business className="text-blue-500" />;
      default:
        return <Timer className="text-blue-500" />;
    }
  };

  return (
    <Card className={getCardStyle()}>
      <CardContent className="p-6">
        <Box className="flex items-start justify-between">
          <Box className="flex-1">
            <Box className="flex items-center gap-2 mb-2">
              {getIconComponent()}
              <Typography 
                color="textSecondary" 
                variant="body2"
                className="font-medium"
              >
                {title}
              </Typography>
              {urgent && (
                <Chip 
                  label="Urgent" 
                  size="small" 
                  color="warning"
                  className="ml-auto"
                />
              )}
            </Box>
            
            <Typography 
              variant="h3" 
              className="font-bold text-gray-700 mb-1"
            >
              {value}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="body2" 
                color="textSecondary"
                className="mb-2"
              >
                {subtitle}
              </Typography>
            )}
            
            {trend && trendValue && (
              <Box className="flex items-center gap-1">
                {getTrendIcon()}
                <Typography 
                  variant="caption" 
                  className={`font-medium ${
                    trend === 'up' ? 'text-green-600' : 
                    trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
