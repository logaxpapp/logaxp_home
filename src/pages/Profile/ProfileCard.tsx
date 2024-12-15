import React from 'react';
import Button from '../../components/common/Button/Button';
import { FaPencilAlt } from 'react-icons/fa';

interface ProfileCardProps {
  title: string;
  value: string;
  onEdit?: () => void;
  isEditable: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, value, onEdit, isEditable }) => {
  return (
    <div
      className="flex justify-between items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4  dark:border-gray-700 transition hover:shadow-xl hover:border-green-500"
      aria-labelledby={`profile-section-${title}`}
    >
      {/* Title and Value */}
      <div className="flex-1">
        <h3
          id={`profile-section-${title}`}
          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-words">{value}</p>
      </div>

      {/* Edit Button */}
      {isEditable && onEdit && (
        <span
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="ml-4 flex items-center justify-center w-8 h-8  hover:bg-lemonGreen hover:text-white text-gray-500 rounded-full shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <FaPencilAlt className="w-4 h-4" />
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
