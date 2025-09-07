'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import { authApi } from '../../lib/api';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // User is already logged in, redirect to dashboard
      router.push('/dashboard');
      return;
    }
    
    setChecking(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(credentials);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checking) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <Box className="text-center">
          <Typography className="text-white text-lg">
            Đang kiểm tra trạng thái đăng nhập...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <Box className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <Box className="w-full max-w-md">
          <Paper
            elevation={12}
            className="p-8 rounded-2xl argon-card"
          >
            <Box className="text-center mb-8">
              <Typography variant="h3" component="h1" className="font-bold text-gray-800 mb-2">
                IRMS
              </Typography>
              <Typography variant="h6" className="text-gray-600 mb-1">
                Idle Resource Management System
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" className="mb-6 rounded-lg">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box className="space-y-6">
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  variant="outlined"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  autoFocus
                  InputProps={{
                    className: "rounded-lg",
                  }}
                />
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  variant="outlined"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  InputProps={{
                    className: "rounded-lg",
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="argon-button-gradient py-4 text-lg font-medium rounded-lg"
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Box>
            </form>

            <Box className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="subtitle2" className="text-gray-700 font-medium mb-3">
                🎯 Tài khoản demo:
              </Typography>
              <Box className="space-y-1">
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Admin:</span> admin / password123
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">RA:</span> ra_all / password123
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Manager:</span> manager_it / password123
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Right Side - Brand/Hero Section */}
      <Box className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <Box className="absolute inset-0 bg-black/20"></Box>
        <Box className="relative z-10 flex items-center justify-center p-12 text-white">
          <Box className="text-center max-w-lg">
            <Box className="mb-8">
              <Box className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Typography variant="h2" className="font-bold text-white">
                  I
                </Typography>
              </Box>
              <Typography variant="h2" className="font-bold mb-4">
                Quản lý Idle Resource
              </Typography>
              <Typography variant="h6" className="text-blue-100 mb-8 leading-relaxed">
                Hệ thống quản lý nguồn lực rảnh rỗi hiệu quả, 
                giúp tối ưu hóa việc phân bổ nhân sự và tài nguyên.
              </Typography>
            </Box>
            
            <Box className="grid grid-cols-1 gap-4 text-left">
              <Box className="flex items-center space-x-3">
                <Box className="w-2 h-2 bg-blue-300 rounded-full"></Box>
                <Typography className="text-blue-100">
                  Theo dõi trạng thái nguồn lực theo thời gian thực
                </Typography>
              </Box>
              <Box className="flex items-center space-x-3">
                <Box className="w-2 h-2 bg-blue-300 rounded-full"></Box>
                <Typography className="text-blue-100">
                  Báo cáo và phân tích chi tiết
                </Typography>
              </Box>
              <Box className="flex items-center space-x-3">
                <Box className="w-2 h-2 bg-blue-300 rounded-full"></Box>
                <Typography className="text-blue-100">
                  Quản lý phân quyền theo vai trò
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Decorative elements */}
        <Box className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></Box>
        <Box className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></Box>
      </Box>
    </Box>
  );
}
