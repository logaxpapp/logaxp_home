// src/components/common/IconButton.tsx

import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'info' | 'light';
  icon: React.ReactNode;
  tooltip: string;
  ariaLabel: string;
  disabled?: boolean;
}

const variantStyles: { [key in IconButtonProps['variant']]: string } = {
  success: 'bg-green-500 hover:bg-green-600',
  warning: 'bg-yellow-500 hover:bg-yellow-600',
  danger: 'bg-red-50 hover:bg-red-600',
  primary: 'bg-blue-50 hover:bg-blue-600',
  secondary: 'bg-gray-500 hover:bg-gray-600',
  info: 'bg-teal-500 hover:bg-teal-600',
  light: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
};

const IconButton: React.FC<IconButtonProps> = ({
  variant,
  icon,
  tooltip,
  ariaLabel,
  disabled,
  className,
  ...props
}) => {
  return (
    <Tippy content={tooltip} placement="top" delay={100}>
      <button
        className={classNames(
          variantStyles[variant],
          'p-2 rounded-full flex items-center justify-center transition-colors duration-200',
          {
            'opacity-50 cursor-not-allowed': disabled,
          },
          className
        )}
        aria-label={ariaLabel}
        disabled={disabled}
        {...props}
      >
        {icon}
      </button>
    </Tippy>
  );
};

export default IconButton;
