'use client';

import React from 'react';
import { Box } from '@mui/material';
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
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Layout Container */}
      <Box 
        className="flex-1 flex flex-col min-w-0"
      >
        {/* Top Bar - now positioned relative to main content */}
        <TopBar 
          onMenuClick={handleSidebarToggle}
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content */}
        <Box 
          component="main" 
          className="flex-1 overflow-auto p-3 lg:p-5"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
