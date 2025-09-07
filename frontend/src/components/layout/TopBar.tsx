'use client';

import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Person,
  Notifications,
} from '@mui/icons-material';

interface TopBarProps {
  onMenuClick?: () => void;
  user?: {
    fullName: string;
    role: string;
    email?: string;
  };
  onLogout?: () => void;
  sidebarOpen?: boolean;
}

export function TopBar({ onMenuClick, user, onLogout, sidebarOpen }: TopBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout?.();
  };

  return (
    <AppBar 
      position="sticky" 
      className="bg-white shadow-sm border-b border-gray-200"
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer - 1,
        top: 0,
        borderRadius: 0,
      }}
    >
      <Toolbar className="px-6">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          className="mr-4 text-gray-700"
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          className="flex-grow text-gray-800 font-semibold"
        >
          IRMS Dashboard
        </Typography>

        <Box className="flex items-center space-x-4">
          <Tooltip title="Thông báo">
            <IconButton className="text-gray-600">
              <Notifications />
            </IconButton>
          </Tooltip>

          <Box className="flex items-center space-x-3">
            <Box className="text-right hidden sm:block">
              <Typography variant="body2" className="text-gray-800 font-medium">
                {user?.fullName || 'Unknown User'}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {user?.role || 'No Role'}
              </Typography>
            </Box>

            <Tooltip title="Tài khoản">
              <IconButton onClick={handleProfileMenuOpen} className="p-1">
                <Avatar className="w-8 h-8 bg-blue-500">
                  {user?.fullName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className="mt-2"
          slotProps={{
            paper: {
              sx: {
                borderRadius: 0,
              }
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} className="min-w-48">
            <AccountCircle className="mr-3 text-gray-600" />
            <Box>
              <Typography variant="body2" className="font-medium">
                Thông tin cá nhân
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Dashboard className="mr-3 text-gray-600" />
            <Typography variant="body2">Dashboard</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout className="mr-3 text-red-500" />
            <Typography variant="body2" className="text-red-500">
              Đăng xuất
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
