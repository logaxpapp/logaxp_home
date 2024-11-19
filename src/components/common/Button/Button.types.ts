// src/components/common/Button.types.ts

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'link' 
  | 'outline' 
  | 'success' 
  | 'warning' 
  | 'info' 
  | 'light'
  | 'edit'
  | 'view'
  | 'delete';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}
