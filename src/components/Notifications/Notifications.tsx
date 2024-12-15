import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '../../api/notificationApi';
import {
  setNotifications,
  markNotificationAsRead,
} from '../../store/slices/notificationSlice';
import { FaBell } from 'react-icons/fa';
import { IUser } from '../../types/user';
import { Notification } from '../../types/notification';
import { motion } from 'framer-motion';

// Type guard function
function isIUser(sender: string | IUser | null): sender is IUser {
    return typeof sender === 'object' && sender !== null && 'name' in sender;
  }
  
const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: notificationsData } = useGetNotificationsQuery();
  const [markNotificationReadApi] = useMarkNotificationAsReadMutation();
  const notifications = useAppSelector((state) => state.notifications.notifications);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (notificationsData) {
      console.log('Notifications Data:', notificationsData);
      dispatch(setNotifications(notificationsData.data));
    }
  }, [dispatch, notificationsData]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationReadApi(notificationId);
    dispatch(markNotificationAsRead(notificationId));
  };

  const renderNotificationMessage = (notification: Notification): string => {
    const senderName = isIUser(notification.sender)
      ? notification.sender.name
      : notification.sender || 'Someone';
  
    switch (notification.type) {
      case 'article_like':
        return `${senderName} liked your article.`;
      case 'article_comment':
        return `${senderName} commented on your article: "${notification.data?.comment}"`;
      default:
        return 'You have a new notification.';
    }
  };
  

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <FaBell className="text-gray-800 dark:text-white w-6 h-6" />
        {notifications.some((notification) => !notification.read) && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-700"></span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <motion.div
          className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
          </div>
          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {renderNotificationMessage(notification)}
                        </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        className="text-blue-500 hover:underline text-xs"
                        onClick={() => handleMarkAsRead(notification._id!)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications found.
              </li>
            )}
          </ul>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;
