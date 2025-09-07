'use client';

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { classNames } from '../../lib/utils';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  variant = 'default',
  padding = 'medium',
  className,
  children,
  ...props
}: CardProps) {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-4';
      case 'medium':
        return 'p-6';
      case 'large':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-200';
      case 'elevated':
        return 'shadow-lg';
      default:
        return 'argon-card';
    }
  };

  return (
    <MuiCard
      {...props}
      className={classNames(
        getVariantClass(),
        'transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      <div className={getPaddingClass()}>
        {children}
      </div>
    </MuiCard>
  );
}
