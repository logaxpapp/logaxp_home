import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'; // Import useAppSelector
import { selectCurrentUser } from '../../store/slices/authSlice'; // Import selector to get current user
import loga from '../../assets/images/loga.png';
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaSass,
  FaClipboardCheck,
  FaClipboardList,
  FaBookOpen,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaUserCog,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaFileAlt,
  FaHome,
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define the structure of each navigation link
interface NavLinkItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current user from Redux store
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Define the main navigation links
  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Tickets', path: '/dashboard/tickets', icon: <FaTicketAlt /> },
    { name: 'MYSurveys', path: '/dashboard/Manage-my-surveys', icon: <FaSass /> },
    { name: 'Approvals', path: '/dashboard/Manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Requests', path: '/dashboard/user-approvals', icon: <FaClipboardList /> },
    { name: 'Resources', path: '/dashboard/manage-resources', icon: <FaBookOpen /> },
    { name: 'Incidents', path: '/dashboard/incidents', icon: <FaExclamationTriangle /> },
    { name: 'Attendance', path: '/dashboard/time-management', icon: <FaClock /> },
  ];

  // Admin-specific links
  const adminLinks: NavLinkItem[] = [
    { name: 'Manage Users', path: '/dashboard/user-management', icon: <FaUsers /> },
    { name: 'Workflow', path: '/dashboard/appraisal', icon: <FaBell /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Scheduling', path: '/dashboard/scheduling', icon: <FaCalendarAlt /> },
    { name: 'Admin', path: '/dashboard/admin', icon: <FaUserCog /> },
    { name: 'Survey', path: '/dashboard/manage-surveys', icon: <FaSass /> }, 
    { name: 'Support', path: '/dashboard/support', icon: <FaBell /> },
    
  ];

  // User-specific links with different icons
  const userLinks: NavLinkItem[] = [
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Documents', path: '/dashboard/shift-calendar', icon: <FaFileAlt /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Shift', path: '/dashboard/Manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Support', path: '/dashboard/support', icon: <FaBell /> },
   
  ];

  // Helper function to render navigation links
  const renderNavLinks = (links: NavLinkItem[]) =>
    links.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) =>
          `flex items-center p-3 my-1 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white'
          }`
        }
      >
        <span className="mr-3">{link.icon}</span>
        <span>{link.name}</span>
      </NavLink>
    ));

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 dark:bg-gray-800 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out z-50 md:translate-x-0 md:static`}
        style={{
          backgroundImage: `url(${loga})`, // Set loga as background image
          backgroundSize: 'cover', // Cover the entire sidebar
          backgroundPosition: 'center', // Center the image
          backgroundRepeat: 'no-repeat', // Do not repeat the image
        }}
      >
        {/* Optional: Overlay to darken the background image for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 bg-blue-900 dark:bg-gray-700 bg-opacity-75">
            <div className="flex items-center space-x-3">
              <NavLink to="/" className="text-white hover:text-gray-300">
                <FaHome size={20} />
              </NavLink>
              <h1 className="text-xl font-bold text-white font-primary">LOGAXP</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden focus:outline-none"
              aria-label="Close Sidebar"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-2 flex-1 overflow-y-auto">
            <div className="px-4">
              <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2">Main</h3>
              {renderNavLinks(navLinks)}

              {/* Divider */}
              <div className="my-1 border-t border-gray-400"></div>

              {/* Admin Section (conditionally render) */}
              {currentUser?.role === 'admin' && (
                <>
                  <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2">Admin</h3>
                  {renderNavLinks(adminLinks)}
                </>
              )}

              {/* User Section (conditionally render) */}
              {currentUser?.role === 'user' && (
                <>
                  <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2">User</h3>
                  {renderNavLinks(userLinks)}
                </>
              )}
            </div>
          </nav>

          {/* Footer (Logout) */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-400 bg-blue-900 dark:bg-gray-700 bg-opacity-75">
            <button
              onClick={handleLogout}
              className="flex items-center p-3 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-red-500 hover:text-white w-full"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
