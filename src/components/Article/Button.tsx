// src/components/common/Button.tsx

import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { FaSpinner } from 'react-icons/fa';

interface ButtonProps extends AntdButtonProps {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <AntdButton disabled={isDisabled} {...rest}>
      {isLoading && <FaSpinner className="animate-spin mr-2" aria-hidden="true" />}
      {leftIcon && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>}
    </AntdButton>
  );
};

export default Button;
