// src/components/Navbar/Navbar.tsx

import React, { useState } from 'react';
import { FaBars, FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';
import DarkModeToggle from '../DarkModeToggle';
import { useAppSelector } from '../../app/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Notifications from '../Notifications/Notifications';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Left Section: Mobile Menu Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-200 focus:outline-none md:hidden"
            aria-label="Toggle Sidebar"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Center Section: Welcome Message */}
        <div className="flex flex-col text-center">
          <div className="font-semibold text-base text-gray-700 dark:text-white">Welcome!</div>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {user?.name || 'User'}
          </span>
        </div>

        {/* Right Section: Notifications, User Profile, Logout, Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative text-gray-700 dark:text-gray-200 hover:text-teal-500 focus:outline-none"
              aria-label="Notifications"
            >
              <FaBell className="w-5 h-5 md:w-6 md:h-6" />
              {/* Notification Badge */}
              <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
            </button>

            {isNotificationOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-80 
                  bg-white dark:bg-gray-700 
                  border border-gray-200 dark:border-gray-600 
                  shadow-lg rounded-md 
                  z-50
                "
              >
                <Notifications />
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="hidden md:flex items-center">
            {user?.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt={`${user.name}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 text-gray-700 dark:text-gray-200" />
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              text-gray-700 dark:text-gray-200 hover:text-red-500 
              border border-gray-300 dark:border-gray-600 
              rounded-full p-2 
              bg-gray-100 dark:bg-gray-700 
              focus:outline-none
              transition-colors duration-200
            "
            aria-label="Logout"
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
