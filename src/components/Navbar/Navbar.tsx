import React from 'react';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import DarkModeToggle from '../DarkModeToggle';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {

  const handleLogout = () => {
    // Placeholder for actual logout functionality
    console.log('User logged out');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex justify-between items-center">
      {/* Sidebar Toggle Button for Mobile View */}
      <button
        onClick={toggleSidebar}
        className="text-gray-500 dark:text-white focus:outline-none md:hidden"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Navbar Title/Logo (Optional) */}
      <h2 className="font-semibold text-blue-900 dark:text-white">Service Center</h2>

      {/* Right-side Controls: Dark Mode Toggle, User Icon, Logout */}
      <div className="flex items-center space-x-4">
       

        {/* User Profile Icon */}
        <FaUserCircle className="w-8 h-8 text-deepBlue dark:text-white" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-red-500 dark:text-white hover:text-lemonGreen focus:outline-none"
          aria-label="Logout"
        >
          <FaSignOutAlt className="w-6 h-6" />
        </button>
         {/* Dark Mode Toggle Component */}
         <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
