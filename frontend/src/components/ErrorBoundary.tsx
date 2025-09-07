'use client';

import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box className="min-h-screen flex items-center justify-center bg-background p-8">
          <Box className="max-w-md w-full">
            <Alert severity="error" className="mb-6">
              <Typography variant="h6" className="mb-2">
                Đã xảy ra lỗi
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-4">
                Ứng dụng đã gặp lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ bộ phận kỹ thuật.
              </Typography>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box className="bg-gray-100 p-3 rounded mt-4">
                  <Typography variant="caption" className="font-mono text-red-600">
                    {this.state.error.message}
                  </Typography>
                </Box>
              )}
            </Alert>
            
            <Box className="flex space-x-4">
              <Button
                variant="contained"
                onClick={this.handleReset}
                className="argon-button-gradient"
              >
                Thử lại
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/'}
              >
                Về trang chủ
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
