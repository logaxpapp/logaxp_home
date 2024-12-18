// src/components/common/Button/Button.tsx

import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'edit'; // New variant
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  iconOnly?: boolean; // New prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  isLoading = false,
  iconOnly = false,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-lemonGreen-light hover:bg-lemonGreen-dark text-white',
    secondary: 'text-gray-700 bg-red-200 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'text-red-600 bg-red-100 hover:bg-red-700 hover:text-white focus:ring-red-500',
    edit: 'text-yellow-300 bg-blue-500 hover:bg-blue-700 hover:text-white focus:ring-blue-500',
  };

  const iconOnlyStyles = iconOnly
    ? 'p-2 rounded-full' // Circular button for icon-only
    : ''; // Default padding for regular buttons

  return (
    <button
      className={classNames(
        baseStyles,
        variantStyles[variant],
        iconOnlyStyles,
        className,
        {
          'px-2 py-2': iconOnly, // Adjust padding for icon-only buttons
        }
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className={classNames('animate-spin h-5 w-5', {
            'text-white': variant === 'primary' || variant === 'edit',
            'text-gray-700': variant === 'secondary',
            'text-red-600': variant === 'danger',
          })}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <>
          {leftIcon && (
            <span className={classNames({ 'mr-2': !iconOnly })}>{leftIcon}</span>
          )}
          {!iconOnly && children}
          {rightIcon && (
            <span className={classNames({ 'ml-2': !iconOnly })}>{rightIcon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
