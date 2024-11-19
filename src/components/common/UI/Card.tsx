import React from 'react';
import { CardProps } from './Card.types';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  shadow = true,
  padding = 'p-6',
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg';
  const shadowClass = shadow ? 'shadow' : '';
  const hoverClass = hoverEffect
    ? 'hover:shadow-xl transform hover:scale-105 transition duration-300'
    : '';
  
  return (
    <div className={`${baseClasses} ${shadowClass} ${hoverClass} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
