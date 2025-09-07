'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { classNames } from '../../lib/utils';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'contained' | 'outlined' | 'text';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          className: 'argon-button-gradient',
        };
      case 'secondary':
        return {
          variant: 'contained' as const,
          color: 'secondary' as const,
        };
      case 'outline':
        return {
          variant: 'outlined' as const,
        };
      case 'ghost':
        return {
          variant: 'text' as const,
        };
      case 'danger':
        return {
          variant: 'contained' as const,
          color: 'error' as const,
        };
      default:
        return {
          variant: variant as 'contained' | 'outlined' | 'text',
        };
    }
  };

  const variantProps = getVariantProps();
  const isDisabled = disabled || loading;

  return (
    <MuiButton
      {...variantProps}
      {...props}
      disabled={isDisabled}
      className={classNames(
        variantProps.className,
        'transition-all duration-200',
        loading && 'opacity-75',
        className
      )}
      startIcon={
        loading ? (
          <CircularProgress size={16} />
        ) : icon && iconPosition === 'start' ? (
          icon
        ) : undefined
      }
      endIcon={icon && iconPosition === 'end' && !loading ? icon : undefined}
    >
      {children}
    </MuiButton>
  );
}
