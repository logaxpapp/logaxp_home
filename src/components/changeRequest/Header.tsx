import React from 'react';
import { FiBell, FiMenu, FiUser } from 'react-icons/fi';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-50 shadow-md rounded-lg p-4 flex justify-between items-center mt-4">
      {/* Title Section */}
      <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
        Change Request
      </h2>

      {/* Action Section */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
       
        {/* User Menu Icon */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="User Menu"
        >
          <FiUser className="h-6 w-6" />
        </button>

        {/* Optional Menu Icon for Smaller Screens */}
        <button
          type="button"
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Menu"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
