import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { IUser } from '../../types/user';

const ProfileHeader: React.FC<{
  user: IUser;
  openProfilePicModal: () => void;
}> = ({ user, openProfilePicModal }) => {
  // Formats date strings into a readable format
  const formatDate = (dateString?: string): string => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Not Provided';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
      {/* Profile Picture and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
        {/* Profile Picture */}
        <div className="relative">
          {user.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-blue-500 dark:border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <button
            onClick={openProfilePicModal}
            className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Change Profile Picture"
          >
            <FaCamera />
          </button>
        </div>

        {/* User Info */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name || 'Unnamed User'}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user.email || 'No Email Provided'}</p>

          {/* Role and Status */}
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium shadow">
              {user.role || 'Unknown Role'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium shadow ${
                user.status === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {user.status || 'Unknown Status'}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.job_title && (
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Job Title:</span>
            <span className="ml-2 text-gray-800 dark:text-white">{user.job_title}</span>
          </div>
        )}
        {user.department && (
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Department:</span>
            <span className="ml-2 text-gray-800 dark:text-white">{user.department}</span>
          </div>
        )}
        {user.phone_number && (
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Phone:</span>
            <span className="ml-2 text-gray-800 dark:text-white">{user.phone_number}</span>
          </div>
        )}
        {user.date_of_birth && (
          <div className="flex items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Date of Birth:</span>
            <span className="ml-2 text-gray-800 dark:text-white">{formatDate(user.date_of_birth)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
