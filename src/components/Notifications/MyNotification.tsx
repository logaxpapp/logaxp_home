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
import { motion, AnimatePresence } from 'framer-motion';

// Type guard function
function isIUser(sender: string | IUser | null): sender is IUser {
  return typeof sender === 'object' && sender !== null && 'name' in sender;
}

const MyNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: notificationsData } = useGetNotificationsQuery();
  const [markNotificationReadApi] = useMarkNotificationAsReadMutation();

  // Notifications from Redux store
  const notifications = useAppSelector((state) => state.notifications.notifications);

  // Controls whether the dropdown is open
  const [isOpen, setIsOpen] = useState(true);

  // On load or whenever notificationsData changes, update the store
  useEffect(() => {
    if (notificationsData) {
      console.log('Notifications Data:', notificationsData);
      dispatch(setNotifications(notificationsData.data));
    }
  }, [dispatch, notificationsData]);

  // Mark notification as read both in the API and in Redux
  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationReadApi(notificationId);
    dispatch(markNotificationAsRead(notificationId));
  };

  // Friendly message for each notification type
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

  // Framer Motion variants for the dropdown container
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <div className="relative max-w-6xl mx-auto justify-center items-center mt-10">
      {/* Notification Bell Icon */}
      <header className="flex items-center justify-between shadow-lg p-4 rounded-lg bg-white dark:bg-gray-800">

        <div className="flex items-center">
          <FaBell className="h-6 w-6 text-green-600" />
        </div>
        <button
          className={`flex items-center px-2 py-1 text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isOpen? 'text-gray-900' : 'text-gray-500'
          } transition duration-150 ease-in-out`}
          onClick={() => setIsOpen(!isOpen)}
        >
            Notifications
        </button>
      
      </header>
     
     

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-full max-w-6xl bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden z-50"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Notifications
              </h3>
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            {/* Notification List */}
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      !notification.read ? 'bg-gray-50 dark:bg-gray-700/25' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="pr-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {renderNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyNotification;
