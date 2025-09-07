'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { 
  Person, 
  Edit, 
  Add, 
  Delete,
  Upload,
  Business,
  AttachMoney,
} from '@mui/icons-material';

interface RecentActivity {
  id: number;
  resourceName: string;
  resourceId: number;
  action: string;
  performedBy: string;
  department: string;
  timestamp: Date;
  description?: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
  maxItems?: number;
}

export function RecentActivities({ activities, maxItems = 5 }: RecentActivitiesProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'resource created':
      case 'created':
        return <Add className="text-green-500" fontSize="small" />;
      case 'status updated':
      case 'updated':
        return <Edit className="text-blue-500" fontSize="small" />;
      case 'cv uploaded':
      case 'uploaded':
        return <Upload className="text-purple-500" fontSize="small" />;
      case 'resource deleted':
      case 'deleted':
        return <Delete className="text-red-500" fontSize="small" />;
      case 'department changed':
        return <Business className="text-orange-500" fontSize="small" />;
      case 'rate updated':
        return <AttachMoney className="text-yellow-600" fontSize="small" />;
      default:
        return <Person className="text-gray-500" fontSize="small" />;
    }
  };

  const getActionColor = (action: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (action.toLowerCase()) {
      case 'resource created':
      case 'created':
        return 'success';
      case 'status updated':
      case 'updated':
        return 'primary';
      case 'cv uploaded':
      case 'uploaded':
        return 'secondary';
      case 'resource deleted':
      case 'deleted':
        return 'error';
      case 'department changed':
        return 'warning';
      case 'rate updated':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <Card className="argon-card">
      <CardHeader
        title={
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Recent Activities
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            Latest updates in the last 7 days
          </Typography>
        }
      />
      <CardContent className="pt-0">
        <Box className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <Box key={activity.id}>
              <Box className="flex items-start gap-3">
                <Avatar className="w-8 h-8 bg-gray-100">
                  {getActionIcon(activity.action)}
                </Avatar>
                
                <Box className="flex-1 min-w-0">
                  <Box className="flex items-center gap-2 mb-1">
                    <Typography 
                      variant="body2" 
                      className="font-medium text-gray-700"
                    >
                      {activity.resourceName}
                    </Typography>
                    <Chip 
                      label={activity.action}
                      size="small"
                      color={getActionColor(activity.action)}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    className="mb-1"
                  >
                    {activity.description || `${activity.action} performed`}
                  </Typography>
                  
                  <Box className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.department}</span>
                    <span>•</span>
                    <span>by {activity.performedBy}</span>
                    <span>•</span>
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </Box>
                </Box>
              </Box>
              
              {index < displayedActivities.length - 1 && (
                <Divider className="mt-4" />
              )}
            </Box>
          ))}
        </Box>
        
        {activities.length > maxItems && (
          <Box className="mt-4 text-center">
            <Typography 
              variant="body2" 
              color="primary"
              className="cursor-pointer hover:underline"
            >
              View all {activities.length} activities
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
