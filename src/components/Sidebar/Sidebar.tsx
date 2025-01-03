// src/components/Admin/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Logo from '../../assets/images/sec.png';
import GreenLogo from '../../assets/images/green.svg';
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
  FaTimes,
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavLinkItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Tickets', path: '/dashboard/tickets', icon: <FaTicketAlt /> },
    { name: 'My Surveys', path: '/dashboard/manage-my-surveys', icon: <FaSass /> },
    { name: 'Approvals', path: '/dashboard/manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'BoardList', path: '/dashboard/board-list', icon: <FaBell /> },
    { name: 'Requests', path: '/dashboard/user-approvals', icon: <FaClipboardList /> },
    { name: 'Resources', path: '/dashboard/manage-resources', icon: <FaBookOpen /> },
    { name: 'Incidents', path: '/dashboard/incidents', icon: <FaExclamationTriangle /> },
    { name: 'Attendance', path: '/dashboard/time-management', icon: <FaClock /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'User Articles', path: '/dashboard/user-articles', icon: <FaBell /> },
  ];

  const adminLinks: NavLinkItem[] = [
    { name: 'Manage Users', path: '/dashboard/user-management', icon: <FaUsers /> },
    { name: 'Workflow', path: '/dashboard/appraisal', icon: <FaClipboardCheck /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Scheduling', path: '/dashboard/scheduling', icon: <FaCalendarAlt /> },
    { name: 'Admin Panel', path: '/dashboard/admin', icon: <FaUserCog /> },
    { name: 'Survey Management', path: '/dashboard/manage-surveys', icon: <FaSass /> },
    { name: 'Admin Support', path: '/dashboard/admin/support', icon: <FaBell /> },
    { name: 'Faqs', path: '/dashboard/faqs', icon: <FaBell /> },
    { name: 'Admin Subscriptions', path: '/dashboard/admin-subscriptions', icon: <FaBell /> },
    { name: 'Contracts', path: '/dashboard/admin/contracts', icon: <FaFileAlt /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Documents', path: '/dashboard/documents/sent', icon: <FaFileAlt /> },
    
  ];

  const userLinks: NavLinkItem[] = [
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Sent Docs', path: '/dashboard/documents/sent', icon: <FaCog /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Shift Management', path: '/dashboard/manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Support', path: '/dashboard/support', icon: <FaBell /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'Change Requests', path: '/dashboard/my-change-requests', icon: <FaBell /> },
  ];

  const contractorLinks: NavLinkItem[] = [
    { name: 'Contracts', path: '/dashboard/contractor/contracts', icon: <FaFileAlt /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Tickets', path: '/dashboard/contractor/tickets', icon: <FaTicketAlt /> },
    { name: 'Payments', path: '/dashboard/contractor/payments', icon: <FaHome /> },
    { name: 'Board', path: '/dashboard/kanban-board', icon: <FaBell /> },
    { name: 'Support', path: '/dashboard/contractor/support', icon: <FaBell /> },
    { name: 'New Board', path: '/dashboard/create-board', icon: <FaBell /> },
    { name: 'BoardList', path: '/dashboard/board-list', icon: <FaBell /> },
    { name: 'SubContractors', path: '/dashboard/subcontractors', icon: <FaClock /> },
    { name: 'Team', path: '/dashboard/contractor/team/list', icon: <FaUsers /> },
  ];

  // Custom Hook to get window width
  const useWindowWidth = () => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
  };

  const windowWidth = useWindowWidth();

  // Determine slice count based on screen size
  const getSliceCount = () => {
    if (windowWidth >= 1024) {
      // Desktop
      return 7;
    } else if (windowWidth >= 768) {
      // Tablet
      return 6;
    } else {
      // Mobile
      return 3;
    }
  };

  const sliceCount = getSliceCount();

  // States to manage "Show More" for Admin and User sections
  const [showAllAdminLinks, setShowAllAdminLinks] = useState(false);
  const [showAllUserLinks, setShowAllUserLinks] = useState(false);

  const toggleShowMoreAdmin = () => {
    setShowAllAdminLinks((prev) => !prev);
  };

  const toggleShowMoreUser = () => {
    setShowAllUserLinks((prev) => !prev);
  };

  // Function to render links with optional "Show More" functionality
  const renderLinks = (
    links: NavLinkItem[],
    showAll: boolean,
    toggleShowMore: () => void
  ) => {
    const linksToShow = showAll ? links : links.slice(0, sliceCount);
    const showToggle = links.length > sliceCount;

    return (
      <div className="space-y-1">
        {linksToShow.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center p-[6px] sidebar rounded-lg text-[14px] font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-teal-100 text-teal-500 dark:bg-gray-700 dark:text-gray-300'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
              }`
            }
            onClick={toggleSidebar} // Close sidebar on link click (for mobile)
          >
            <span className="mr-3">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
        {showToggle && (
          <button
            className="mt-2 text-xs text-teal-600 hover:underline"
            onClick={toggleShowMore}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800
          shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-50
          md:translate-x-0 md:static md:inset-0
        `}
        aria-label="Sidebar"
      >
        {/* Sidebar Content */}
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 py-4">
            <NavLink to="/" className="flex items-center text-teal-500 hover:text-teal-400 sidebar">
              {/* Light Mode Logo */}
              <img src={Logo} alt="Logo" className="ml-2 h-6 block dark:hidden" />

              {/* Dark Mode GreenLogo */}
              <img src={GreenLogo} alt="Logo Dark Mode" className="hidden ml-2 h-6 dark:block" />

              {/* Text Only Visible in Dark Mode */}
              <span className="hidden dark:inline-block text-gray-700 dark:text-gray-300 font-semibold text-lg ml-4">
                Loga<span className="text-lemonGreen-light">XP</span>
              </span>
            </NavLink>

            {/* Close button for mobile */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Close Sidebar"
            >
              <FaTimes size={24} className="text-gray-700 dark:text-gray-300 hover:text-teal-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
            {/* Main Links */}
            {currentUser?.role !== 'contractor' && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mb-2">
                  Main
                </h3>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center p-[6px] sidebar rounded-lg text-[13px] font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-teal-100 text-teal-500 dark:bg-gray-700 dark:text-gray-300'
                            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`
                      }
                      onClick={toggleSidebar} // Close sidebar on link click (for mobile)
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}

            {/* Admin Links */}
            {currentUser?.role === 'admin' && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  Admin Panel
                </h3>
                {renderLinks(adminLinks, showAllAdminLinks, toggleShowMoreAdmin)}
              </>
            )}

            {/* User Links */}
            {currentUser?.role === 'user' && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  User Panel
                </h3>
                {renderLinks(userLinks, showAllUserLinks, toggleShowMoreUser)}
              </>
            )}

            {/* Contractor Links */}
            {currentUser?.role === 'contractor' && (
              <>
                {/* Contractor Section Header */}
                <div className="mt-6 mb-4 px-4 py-8 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm text-lg">
                  <h3 className="text-teal-500 text-sm font-semibold">Contractor Hub</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base mt-1">
                    Manage and oversee all contractor-related activities, agreements, and resources.
                  </p>
                </div>
                <div className="space-y-1 text-lg">
                  {contractorLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center p-[6px] sidebar rounded-lg text-[13px] font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-teal-100 text-teal-500 dark:bg-gray-700 dark:text-gray-300'
                            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`
                      }
                      onClick={toggleSidebar} // Close sidebar on link click (for mobile)
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
