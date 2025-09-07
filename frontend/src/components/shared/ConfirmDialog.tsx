'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close, Warning, CheckCircle, Error, Info } from '@mui/icons-material';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Error className="text-red-500 text-6xl" />;
      case 'warning':
        return <Warning className="text-orange-500 text-6xl" />;
      case 'success':
        return <CheckCircle className="text-green-500 text-6xl" />;
      case 'info':
      default:
        return <Info className="text-blue-500 text-6xl" />;
    }
  };

  const getConfirmButtonProps = () => {
    switch (variant) {
      case 'danger':
        return { 
          variant: 'contained' as const, 
          color: 'error' as const,
          className: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return { 
          variant: 'contained' as const, 
          color: 'warning' as const,
          className: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'success':
        return { 
          variant: 'contained' as const, 
          color: 'success' as const,
          className: 'bg-green-600 hover:bg-green-700'
        };
      case 'info':
      default:
        return { 
          variant: 'contained' as const, 
          className: 'argon-button-gradient'
        };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-xl',
      }}
    >
      <DialogTitle className="relative">
        <Typography variant="h6" className="font-semibold text-gray-800">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="pt-4">
        <Box className="flex flex-col items-center text-center space-y-4">
          {getIcon()}
          <Typography variant="body1" className="text-gray-700">
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions className="p-6 pt-4">
        <Button
          onClick={onCancel}
          variant="outlined"
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          {...getConfirmButtonProps()}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
