'use client';

import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { classNames } from '../../lib/utils';

export interface InputProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export function Input({
  variant = 'outlined',
  className,
  InputProps,
  ...props
}: InputProps) {
  return (
    <MuiTextField
      variant={variant}
      {...props}
      className={classNames('w-full', className)}
      InputProps={{
        ...InputProps,
        className: classNames(
          'rounded-lg',
          variant === 'outlined' && 'border-gray-300 focus:border-blue-500',
          InputProps?.className
        ),
      }}
    />
  );
}
