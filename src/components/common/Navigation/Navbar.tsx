// src/components/common/Navigation/Navbar/Navbar.tsx

import React from 'react';
import { NavbarProps } from './Navbar.types';
import { Link } from 'react-router-dom';
import { useNavigate } from'react-router-dom';
import Button from '../Button/Button';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../store/slices/authSlice';

const Navbar: React.FC<NavbarProps> = ({ children, className = '' }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className={`bg-white dark:bg-gray-800 shadow ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-lemonGreen-light">LogaXP</span>
            </Link>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              {/* Add navigation links here */}
              <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-lemonGreen-light text-sm font-medium text-gray-900 dark:text-white">
                Dashboard
              </Link>
              {/* Add more links as needed */}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {user.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-200">{user.name}</span>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-lemonGreen-light">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-lemonGreen-light">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Implement mobile menu toggle and links if needed */}
    </nav>
  );
};

export default Navbar;
