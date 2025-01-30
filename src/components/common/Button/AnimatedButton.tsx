// src/components/Button/AnimatedButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface AnimatedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  Icon?: IconType;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  children,
  disabled = false,
  className = '',
  Icon,
  type = 'button',
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
