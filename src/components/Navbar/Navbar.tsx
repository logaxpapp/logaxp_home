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
    <header 
      className="
        relative 
        flex items-center justify-between 
        w-full px-4 py-2 
        bg-deepBlue-dark dark:bg-gray-700
          before:content-[''] before:absolute before:inset-0
          before:bg-[url('../../assets/images/star.svg')] before:bg-repeat before:bg-[length:20px_20px]
          before:animate-twinkle
          before:pointer-events-none
        text-white
      "
    >
     
      <div
        className="
          absolute inset-0 
          bg-[url('../../assets/images/star.svg')] bg-repeat bg-[length:20px_20px] 
          opacity-80
          animate-twinkle
          pointer-events-none
          z-[-1]
        "
      ></div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-white focus:outline-none md:hidden"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Center Content */}
      <div className="flex flex-col text-left">
        <h2 className="font-semibold text-base items-start">Welcome !</h2>
        <p className="text-sm text-gray-200 dark:text-gray-300">
          {user?.name || 'User'}
        </p>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative text-white hover:text-lemonGreen focus:outline-none"
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5 md:w-6 md:h-6" />
            {/* Notification Badge */}
            <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
          </button>

          {isNotificationOpen && (
            <div
              className="
                absolute right-0 mt-2 w-96 
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

        {/* User Profile Section */}
        <div className="hidden md:flex items-center space-x-2">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={`${user.name}'s profile`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            text-white hover:text-red-400 
            border border-white/20 
            rounded-full p-2 
            bg-white/10 
            focus:outline-none
            transition-colors duration-150
          "
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
