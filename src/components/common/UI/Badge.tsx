// src/components/common/UI/Badge/Badge.tsx

import React from 'react';
import { BadgeProps } from './Badge.types';

const variantClasses: Record<BadgeProps['variant'], string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
