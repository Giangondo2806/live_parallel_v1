'use client';

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <Box className="flex min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar 
        onMenuClick={handleSidebarToggle}
        user={user}
        onLogout={handleLogout}
      />

      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <Box 
        component="main" 
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}
        `}
        sx={{
          paddingTop: '64px', // TopBar height
        }}
      >
        <Box className="p-6">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
