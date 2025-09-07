'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import {
  FileUpload,
  FileDownload,
  PersonAdd,
  Refresh,
  Assessment,
  History,
} from '@mui/icons-material';

interface QuickActionsProps {
  onImportClick?: () => void;
  onExportClick?: () => void;
  onAddResourceClick?: () => void;
  onRefreshClick?: () => void;
  onViewReportsClick?: () => void;
  onViewHistoryClick?: () => void;
}

export function QuickActions({
  onImportClick,
  onExportClick,
  onAddResourceClick,
  onRefreshClick,
  onViewReportsClick,
  onViewHistoryClick,
}: QuickActionsProps) {
  const primaryActions = [
    {
      label: 'Import Excel',
      icon: <FileUpload />,
      onClick: onImportClick,
      color: 'primary' as const,
      description: 'Import resources from Excel file',
    },
    {
      label: 'Export Data',
      icon: <FileDownload />,
      onClick: onExportClick,
      color: 'secondary' as const,
      description: 'Export current data to Excel',
    },
    {
      label: 'Add Resource',
      icon: <PersonAdd />,
      onClick: onAddResourceClick,
      color: 'success' as const,
      description: 'Add new idle resource',
    },
  ];

  const secondaryActions = [
    {
      label: 'Refresh Data',
      icon: <Refresh />,
      onClick: onRefreshClick,
      variant: 'outlined' as const,
    },
    {
      label: 'View Reports',
      icon: <Assessment />,
      onClick: onViewReportsClick,
      variant: 'outlined' as const,
    },
    {
      label: 'History Log',
      icon: <History />,
      onClick: onViewHistoryClick,
      variant: 'outlined' as const,
    },
  ];

  return (
    <Card className="argon-card">
      <CardHeader
        title={
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Quick Actions
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            Frequently used actions and shortcuts
          </Typography>
        }
      />
      <CardContent className="pt-0">
        {/* Primary Actions */}
        <Box className="space-y-3 mb-4">
          {primaryActions.map((action, index) => (
            <Box key={index} className="flex items-center gap-3">
              <Button
                variant="contained"
                color={action.color}
                startIcon={action.icon}
                onClick={action.onClick}
                className="min-w-[140px]"
                size="medium"
              >
                {action.label}
              </Button>
              <Typography variant="body2" color="textSecondary" className="flex-1">
                {action.description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider className="my-4" />

        {/* Secondary Actions */}
        <Box className="flex flex-wrap gap-2">
          {secondaryActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              startIcon={action.icon}
              onClick={action.onClick}
              size="small"
              className="text-gray-600"
            >
              {action.label}
            </Button>
          ))}
        </Box>

        {/* Info Text */}
        <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Typography variant="caption" className="text-blue-700">
            💡 Tip: Use keyboard shortcuts for faster navigation. 
            Press Ctrl+I for Import, Ctrl+E for Export, Ctrl+N for Add Resource.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
