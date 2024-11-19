import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/images/sec.png';
import DarkModeToggle from '../DarkModeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-900 shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w- h-6" />
          <Link to="/" className="text-2xl font-bold text-gray-700 dark:text-white">
           
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <FaTimes className="w-6 h-6 text-gray-700" /> : <FaBars className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Navigation Links - Hidden on mobile, visible on larger screens */}
        <nav className={`hidden md:flex space-x-6 text-lg`}>
          <Link to="/home" className="text-gray-700 font-semibold hover:text-lemonGreen dark:text-white">Home</Link>
          <Link to="/about" className="text-gray-700 font-semibold hover:text-lemonGreen dark:text-white">About</Link>
          <Link to="/contact" className="text-gray-700 font-semibold hover:text-lemonGreen dark:text-white">Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="bg-lemonGreen-light text-white  px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
            My Portal
          </Link>
          <DarkModeToggle  />
        </div>
      </div>

      {/* Mobile Menu - Visible on mobile, hidden on larger screens */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="space-y-4">
            <li>
              <Link to="/home" className="block text-center text-gray-700 font-semibold hover:text-lemonGreen">Home</Link>
            </li>
            <li>
              <Link to="/about" className="block text-center text-gray-700 font-semibold hover:text-lemonGreen">About</Link>
            </li>
            <li>
              <Link to="/contact" className="block text-center text-gray-700 font-semibold hover:text-lemonGreen">Contact</Link>
            </li>
            <li className="text-center">
              <Link to="/login" className="bg-lemonGreen-light text-gray-700 px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 inline-block">
                My Portal
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
