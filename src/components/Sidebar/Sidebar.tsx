import React from 'react';
import { NavLink } from 'react-router-dom';
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
  // Define the main navigation links
  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Tickets', path: '/dashboard/profile', icon: <FaTicketAlt /> },
    { name: 'Surveys', path: '/dashboard/surveys', icon: <FaSass /> },
    { name: 'Approvals', path: '/dashboard/approvals', icon: <FaClipboardCheck /> },
    { name: 'Requests', path: '/dashboard/requests', icon: <FaClipboardList /> },
    { name: 'Resources', path: '/dashboard/resources', icon: <FaBookOpen /> },
    { name: 'Incidents', path: '/dashboard/incidents', icon: <FaExclamationTriangle /> },
    { name: 'Scheduling', path: '/dashboard/scheduling', icon: <FaCalendarAlt /> },
    { name: 'Attendance', path: '/dashboard/attendance', icon: <FaClock /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <FaBell /> },
  ];

  // Admin-specific links
  const adminLinks: NavLinkItem[] = [
    { name: 'Manage Users', path: '/dashboard/manage-users', icon: <FaUsers /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    { name: 'Admin', path: '/dashboard/admin', icon: <FaUserCog /> },
  ];

  // Helper function to render navigation links
  const renderNavLinks = (links: NavLinkItem[]) =>
    links.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) =>
          `flex items-center p-3 my-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-lemonGreen text-deepBlue' : 'text-white hover:bg-gray-700 hover:text-white'
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
        className={`fixed inset-y-0 left-0 bg-deepBlue-dark dark:bg-gray-900 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out z-50 md:translate-x-0 md:static`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 dark:bg-black">
          <h1 className="text-xl font-bold text-white">LogaXP</h1>
          <button onClick={toggleSidebar} className="md:hidden focus:outline-none" aria-label="Close Sidebar">
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
        <nav className="mt-6">
          <div className="px-4">
            <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2">Main</h3>
            {renderNavLinks(navLinks)}

            {/* Divider */}
            <div className="my-4 border-t border-gray-700"></div>

            {/* Admin Section */}
            <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2">Admin</h3>
            {renderNavLinks(adminLinks)}
          </div>
        </nav>

        {/* Footer (Logout) */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <NavLink
            to="/logout"
            className="flex items-center p-3 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-red-500 hover:text-white"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
