// src/components/common/Button.tsx

import React from 'react';
import { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
import { FaSpinner } from 'react-icons/fa';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-lemonGreen-light hover:bg-lemonGreen-dark text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  link: 'bg-transparent hover:underline text-lemonGreen-light',
  outline: 'bg-transparent border-2 border-lemonGreen-light text-lemonGreen-light hover:bg-lemonGreen-light hover:text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-teal-500 hover:bg-teal-600 text-white',
  light: 'bg-gray-200 text-gray-700 hover:bg-gray-300',

  // New variants
  edit: 'bg-blue-500 hover:bg-blue-600 text-white',
  view: 'bg-indigo-500 hover:bg-indigo-600 text-white',
  delete: 'bg-red-500 hover:bg-red-700 text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lemonGreen-light ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'transition duration-200 ease-in-out'
      } ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && (
        <FaSpinner className="animate-spin mr-2" aria-hidden="true" />
      )}
      {leftIcon && (
        <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
