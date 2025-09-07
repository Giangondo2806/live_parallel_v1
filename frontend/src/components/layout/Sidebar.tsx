'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  Business,
  People,
  History,
  FolderOpen,
  ExpandLess,
  ExpandMore,
  Settings,
  Assessment,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  user?: {
    role: string;
    permissions?: string[];
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    id: 'resources',
    label: 'Quản lý Idle Resources',
    icon: <Business />,
    children: [
      {
        id: 'resources-list',
        label: 'Danh sách Resources',
        icon: <FolderOpen />,
        path: '/resources',
      },
      {
        id: 'resources-add',
        label: 'Thêm Resource',
        icon: <FolderOpen />,
        path: '/resources/add',
      },
    ],
  },
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: <People />,
    path: '/users',
    roles: ['admin', 'ra_all'],
  },
  {
    id: 'reports',
    label: 'Báo cáo & Thống kê',
    icon: <Assessment />,
    children: [
      {
        id: 'reports-dashboard',
        label: 'Dashboard báo cáo',
        icon: <Assessment />,
        path: '/reports',
      },
      {
        id: 'reports-export',
        label: 'Xuất báo cáo',
        icon: <Assessment />,
        path: '/reports/export',
      },
    ],
  },
  {
    id: 'history',
    label: 'Lịch sử cập nhật',
    icon: <History />,
    path: '/history',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: <Settings />,
    path: '/settings',
    roles: ['admin'],
  },
];

const DRAWER_WIDTH = 270;

export function Sidebar({ open, onClose, user }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Auto-expand parent menu if current page is a child
  React.useEffect(() => {
    const currentExpandedItems: string[] = [];
    
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => pathname === child.path);
        if (hasActiveChild) {
          currentExpandedItems.push(item.id);
        }
      }
    });
    
    setExpandedItems(currentExpandedItems);
  }, [pathname]);

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      onClose?.();
    } else if (item.children) {
      const isExpanded = expandedItems.includes(item.id);
      if (isExpanded) {
        setExpandedItems(prev => prev.filter(id => id !== item.id));
      } else {
        setExpandedItems(prev => [...prev, item.id]);
      }
    }
  };

  const isItemVisible = (item: MenuItem): boolean => {
    if (!item.roles || !user?.role) return true;
    return item.roles.includes(user.role);
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => pathname === child.path);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (!isItemVisible(item)) return null;

    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            className={`
              ${depth > 0 ? 'pl-12' : 'pl-4'}
              ${isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''}
              hover:bg-gray-50 transition-colors duration-200
            `}
          >
            <ListItemIcon className={`${isActive ? 'text-blue-600' : 'text-gray-600'} min-w-0 mr-4`}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                variant: 'body2',
                className: `${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`,
              }}
            />
            {item.children && (
              isExpanded ? 
                <ExpandLess className="text-gray-600" /> : 
                <ExpandMore className="text-gray-600" />
            )}
          </ListItemButton>
        </ListItem>
        
        {item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box className="h-full bg-white flex flex-col">
      {/* Logo Section - Now matches TopBar height */}
      <Box className="p-6 border-b border-gray-200 min-h-[64px] flex items-center">
        <Box>
          <Typography variant="h5" className="font-bold text-gray-800 mb-1">
            IRMS
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Idle Resource Management
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box className="flex-1 overflow-y-auto">
        <List className="py-4">
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box className="p-4 border-t border-gray-200">
        <Typography variant="caption" className="text-gray-500 text-center block">
          © 2025 IRMS System v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            top: 0,
            height: '100vh',
            zIndex: (theme) => theme.zIndex.drawer + 2,
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            top: 0,
            height: '100vh',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            zIndex: (theme) => theme.zIndex.drawer,
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
