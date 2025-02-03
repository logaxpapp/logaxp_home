// src/components/Admin/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

import Logo from '../../assets/images/sec.png';
import GreenLogo from '../../assets/images/green.svg';
import { UserRole } from '../../types/enums';

// Icons
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
  FaSkyatlas,
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

  // Common links for normal users
  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Tickets', path: '/dashboard/tickets', icon: <FaTicketAlt /> },
    { name: 'MySurveys', path: '/dashboard/manage-my-surveys', icon: <FaSass /> },
    { name: 'Approvals', path: '/dashboard/manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'BoardList', path: '/dashboard/board-list', icon: <FaBell /> },
    { name: 'Requests', path: '/dashboard/user-approvals', icon: <FaClipboardList /> },
    { name: 'Resources', path: '/dashboard/manage-resources', icon: <FaBookOpen /> },
    { name: 'Incidents', path: '/dashboard/incidents', icon: <FaExclamationTriangle /> },
    { name: 'Attendance', path: '/dashboard/time-management', icon: <FaClock /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'Articles', path: '/dashboard/user-articles', icon: <FaBell /> },
    { name: 'Reference', path: '/dashboard/references', icon: <FaClock /> },
  ];

  // Admin links
  const adminLinks: NavLinkItem[] = [
    { name: 'Users', path: '/dashboard/user-management', icon: <FaUsers /> },
    { name: 'Workflow', path: '/dashboard/appraisal', icon: <FaClipboardCheck /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Scheduling', path: '/dashboard/scheduling', icon: <FaCalendarAlt /> },
    { name: 'Admin', path: '/dashboard/admin', icon: <FaUserCog /> },
    { name: 'Survey', path: '/dashboard/manage-surveys', icon: <FaSass /> },
    { name: 'Support', path: '/dashboard/admin/support', icon: <FaBell /> },
    { name: 'Faqs', path: '/dashboard/faqs', icon: <FaBell /> },
    { name: 'Subscriptions', path: '/dashboard/admin-subscriptions', icon: <FaBell /> },
    { name: 'Contracts', path: '/dashboard/admin/contracts', icon: <FaFileAlt /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Test Manager', path: '/dashboard/test-management', icon: <FaBell /> },
  ];

  // Basic user links
  const userLinks: NavLinkItem[] = [
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Sent Docs', path: '/dashboard/documents/sent', icon: <FaCog /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Shift', path: '/dashboard/manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Support', path: '/dashboard/support', icon: <FaBell /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'Change Requests', path: '/dashboard/my-change-requests', icon: <FaBell /> },
    { name: 'Test Manager', path: '/dashboard/test-manager', icon: <FaBell /> },
  ];

  // Contractor / SubContractor links
  const contractorLinks: NavLinkItem[] = [
    { name: 'Contracts', path: '/dashboard/contractor/contracts', icon: <FaFileAlt /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Tickets', path: '/dashboard/tickets', icon: <FaTicketAlt /> },
    { name: 'Payments', path: '/dashboard/contractor/payments', icon: <FaHome /> },
    { name: 'Support', path: '/dashboard/contractor/support', icon: <FaBell /> },
    { name: 'BoardList', path: '/dashboard/board-list', icon: <FaBell /> },
    { name: 'SubContractors', path: '/dashboard/subcontractors', icon: <FaClock /> },
    { name: 'Team', path: '/dashboard/contractor/team/list', icon: <FaUsers /> },
  ];

  // Tester role links
  const testerLinks: NavLinkItem[] = [
    { name: 'Test Manager', path: '/dashboard/test-management', icon: <FaBell /> },
    { name: 'Tickets', path: '/dashboard/tickets', icon: <FaTicketAlt /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <FaFileAlt /> },
    { name: 'Support', path: '/dashboard/tester/support', icon: <FaBell /> },
    { name: 'BoardList', path: '/dashboard/board-list', icon: <FaBell /> },
    { name: 'Team', path: '/dashboard/team/list', icon: <FaUsers /> },
  ];

  // Hook to detect window width
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

  // Decide how many links to show at once based on screen size
  const getSliceCount = () => {
    if (windowWidth >= 1024) {
      return 5; // Desktop
    } else if (windowWidth >= 768) {
      return 4; // Tablet
    }
    return 3; // Mobile
  };

  const sliceCount = getSliceCount();

  // States for "Show More" toggles
  const [showAllAdminLinks, setShowAllAdminLinks] = useState(false);
  const [showAllUserLinks, setShowAllUserLinks] = useState(false);

  const toggleShowMoreAdmin = () => setShowAllAdminLinks((prev) => !prev);
  const toggleShowMoreUser = () => setShowAllUserLinks((prev) => !prev);

  // Helper to render a set of links with optional "show more"
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
            onClick={toggleSidebar} // close sidebar after link click (mobile)
          >
            <span className="mr-3">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
        {showToggle && (
          <button
            className="mt-2 text-xs text-teal-600 hover:underline focus:outline-none flex items-center"
            onClick={toggleShowMore}
          >
            <FaSkyatlas className=" text-gray-800 mr-3 font-bold ml-2" />
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile viewport */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Actual Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800
          shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-50
          md:translate-x-0 md:static md:inset-0
        `}
        aria-label="Sidebar"
      >
        {/* Sidebar Inner Content */}
        <div className="relative flex flex-col h-full">
          {/* Header / Logo */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 py-4">
            <NavLink to="/" className="flex items-center text-teal-500 hover:text-teal-400 sidebar">
              {/* Light Mode Logo */}
              <img src={Logo} alt="Logo" className="ml-2 h-6 block dark:hidden" />
              {/* Dark Mode Logo */}
              <img src={GreenLogo} alt="Logo Dark Mode" className="hidden ml-2 h-6 dark:block" />

              <span className="hidden dark:inline-block text-gray-700 dark:text-gray-300 font-semibold text-lg ml-4">
                Loga<span className="text-lemonGreen-light">XP</span>
              </span>
            </NavLink>

            {/* Close button (mobile) */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Close Sidebar"
            >
              <FaTimes size={24} className="text-gray-700 dark:text-gray-300 hover:text-teal-500" />
            </button>
          </div>

          {/* Scrollable Navigation Area */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
            {/* If user is NOT contractor/subcontractor, show "Main" block */}
            {currentUser?.role !== UserRole.Contractor &&
             currentUser?.role !== UserRole.SubContractor && 
             currentUser?.role !== UserRole.Tester && (
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
                      onClick={toggleSidebar}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}

            {/* Admin Panel Links */}
            {currentUser?.role === UserRole.Admin && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  Admin Panel
                </h3>
                {renderLinks(adminLinks, showAllAdminLinks, toggleShowMoreAdmin)}
              </>
            )}

            {/* Normal user (role = 'user') */}
            {currentUser?.role === UserRole.User && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  User Panel
                </h3>
                {renderLinks(userLinks, showAllUserLinks, toggleShowMoreUser)}
              </>
            )}

            {/* Tester role */}
            {currentUser?.role === UserRole.Tester && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  Tester Panel
                </h3>
                <div className="border-b "/>
                <p className="text-gray-500 dark:text-gray-400 text-sm tracking-wide mb-4">
                  Manage your testing tasks, tickets, and resources here.
                </p>
                <div className="border-b "/>
                <div className="space-y-2 text-lg">
                  {testerLinks.map((link) => (
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
                      onClick={toggleSidebar}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}

            {/* Contractor or SubContractor */}
            {(currentUser?.role === UserRole.Contractor ||
              currentUser?.role === UserRole.SubContractor) && (
              <>
                <h3 className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wide mt-6 mb-2">
                  Contractor Panel
                </h3>
                <div className="border-b "/>
                <p className="text-gray-500 dark:text-gray-400 text-sm tracking-wide mb-4">
                  Manage your contracts, resources, and team oversight here.
                </p>
                <div className="border-b "/>

                <div className="space-y-2 text-lg">
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
                      onClick={toggleSidebar}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* Logout Footer */}
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
