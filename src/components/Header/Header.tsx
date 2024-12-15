import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import DarkModeToggle from '../DarkModeToggle';
import logo from '../../assets/images/sec.png';

const sections = [
  { id: 'home', label: 'Home', link: '/' },
  { id: 'about', label: 'About', link: '/about' },
  // { id: 'blog', label: 'Blog', link: '/#blog' }, // Blog section within Home
  { id: 'contact', label: 'Contact', link: '/contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
 
  // Determine the active section
  const getActiveSection = (): string => {
    const currentPath = location.pathname + location.hash;
    const section = sections.find((s) => s.link === currentPath || s.link === location.pathname);
    return section ? section.id : sections[0].id; // Default to 'Home'
  };

  const [activeSection, setActiveSection] = useState<string>(getActiveSection);

  // Update active section on route change
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-900 shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold text-gray-700 dark:text-white">
            <img src={logo} alt="Logo" className="h-6 w-auto" />
          </Link>
        </div>

        {/* Mobile Menu and Dark Mode Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="bg-transparent focus:outline-none"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-700 dark:text-white" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-700 dark:text-white" />
            )}
          </button>
          <DarkModeToggle />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.link}
              className={`text-gray-700 font-semibold hover:text-lemonGreen dark:text-white ${
                activeSection === section.id ? 'border-b-2 border-lemonGreen' : ''
              }`}
            >
              {section.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4 bg-transparent">
          <Link
            to="/login"
            className="bg-lemonGreen-light text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
          >
            My Portal
          </Link>
          <DarkModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  to={section.link}
                  className="block text-center text-gray-700 font-semibold hover:text-lemonGreen dark:text-white"
                  onClick={closeMenu}
                >
                  {section.label}
                </Link>
              </li>
            ))}
            <li className="text-center">
              <Link
                to="/login"
                className="bg-lemonGreen-light text-white font-bold px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 inline-block"
                onClick={closeMenu}
              >
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
