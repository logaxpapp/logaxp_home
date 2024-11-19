// src/components/Navbar/Navbar.tsx

import React from 'react';
import { FaBars, FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';
import DarkModeToggle from '../DarkModeToggle';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const handleLogout = () => {
    console.log('User logged out');
  };

  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex justify-between items-center w-full">
      {/* Sidebar Toggle Button for Mobile View */}
      <button
        onClick={toggleSidebar}
        className="text-gray-500 dark:text-white focus:outline-none md:hidden"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Navbar Center Content (Greeting and Welcome Message) */}
      <div className="flex flex-col items-center">
        <h2 className="font-semibold text-blue-900 dark:text-white text-lg">Service Center</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name || 'User'}</p>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell */}
        <button
          className="relative text-gray-500 hover:text-lemonGreen focus:outline-none dark:text-gray-400 dark:hover:text-lemonGreen"
          aria-label="Notifications"
        >
          <FaBell className="w-5 h-5 md:w-6 md:h-6" />
          {/* Badge */}
          <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
        </button>

        {/* User Profile Section */}
        <div className="hidden md:flex items-center space-x-2">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={`${user.name}'s profile`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-8 h-8 text-deepBlue dark:text-white" />
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-gray-500 border rounded-full p-2 bg-slate-50 hover:text-lemonGreen dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
          aria-label="Logout"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
