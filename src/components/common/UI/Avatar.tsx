import React from 'react';
import { AvatarProps } from './Avatar.types';

const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
  small: 'h-8 w-8',
  medium: 'h-12 w-12',
  large: 'h-16 w-16',
};

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 'medium', className = '' }) => {
  const avatarSize = size || 'medium'; // Ensure `size` is always defined
  return (
    <div className={`rounded-full overflow-hidden ${sizeClasses[avatarSize]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
          {/* Placeholder initials or icon */}
          <span className="text-lg font-medium">U</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
