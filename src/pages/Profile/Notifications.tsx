import React from 'react';
import { FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const mockNotifications = [
  {
    id: 1,
    type: 'success',
    message: 'Your password was successfully updated!',
    timestamp: '2024-11-13 12:34 PM',
  },
  {
    id: 2,
    type: 'error',
    message: 'Failed to update your profile picture. Please try again.',
    timestamp: '2024-11-12 09:20 AM',
  },
  {
    id: 3,
    type: 'info',
    message: 'New security feature: Enable two-factor authentication for added security.',
    timestamp: '2024-11-10 03:45 PM',
  },
];

const Notifications: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700  shadow-lg rounded-lg p-8 w-full max-w-xl mx-auto mt-4 mb-20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-lemonGreen-light font-primary border-b pb-2 mb-4">Notifications</h2>
        <p className="text-gray-600 mt-2 dark:text-gray-50">
          Stay updated with the latest account-related alerts and updates.
        </p>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-sm flex items-center space-x-4 ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-400 text-green-700'
                : notification.type === 'error'
                ? 'bg-red-50 border border-red-400 text-red-700'
                : 'bg-blue-50 border border-blue-400 text-blue-700'
            }`}
          >
            <div>
              {notification.type === 'success' && <FaCheckCircle className="h-6 w-6 text-green-500" />}
              {notification.type === 'error' && <FaTimesCircle className="h-6 w-6 text-red-500" />}
              {notification.type === 'info' && <FaBell className="h-6 w-6 text-blue-500" />}
            </div>
            <div>
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500">{notification.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
