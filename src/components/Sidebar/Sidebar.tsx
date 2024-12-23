import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
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
    { name: 'MYSurveys', path: '/dashboard/Manage-my-surveys', icon: <FaSass /> },
    { name: 'Approvals', path: '/dashboard/Manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Requests', path: '/dashboard/user-approvals', icon: <FaClipboardList /> },
    { name: 'Resources', path: '/dashboard/manage-resources', icon: <FaBookOpen /> },
    { name: 'Incidents', path: '/dashboard/incidents', icon: <FaExclamationTriangle /> },
    { name: 'Attendance', path: '/dashboard/time-management', icon: <FaClock /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'User Article', path: '/dashboard/user-articles', icon: <FaBell /> },
  ];

  const adminLinks: NavLinkItem[] = [
    { name: 'Manage Users', path: '/dashboard/user-management', icon: <FaUsers /> },
    { name: 'Workflow', path: '/dashboard/appraisal', icon: <FaBell /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Scheduling', path: '/dashboard/scheduling', icon: <FaCalendarAlt /> },
    { name: 'Admin', path: '/dashboard/admin', icon: <FaUserCog /> },
    { name: 'Survey', path: '/dashboard/manage-surveys', icon: <FaSass /> },
    { name: 'Admin Support', path: '/dashboard/admin/support', icon: <FaBell /> },
    { name: 'Faqs', path: '/dashboard/faqs', icon: <FaBell /> },
    { name: 'Admin Subscription', path: '/dashboard/admin-subscriptions', icon: <FaBell /> },
    { name: 'Contracts', path: '/dashboard/admin/contracts', icon: <FaBell /> },
  ];

  const userLinks: NavLinkItem[] = [
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Documents', path: '/dashboard/shift-calendar', icon: <FaFileAlt /> },
    { name: 'Settings', path: '/dashboard/profile-settings', icon: <FaCog /> },
    { name: 'Shift', path: '/dashboard/Manage-shifts', icon: <FaClipboardCheck /> },
    { name: 'Support', path: '/dashboard/support', icon: <FaBell /> },
    { name: 'Pay', path: '/dashboard/employeePayPeriods', icon: <FaHome /> },
    { name: 'MyChangeRequest', path: '/dashboard/my-change-requests', icon: <FaBell /> },
  ];

  const contractorLinks: NavLinkItem[] = [
    { name: 'Contact', path: '/dashboard/contractor/contracts', icon: <FaUserCircle /> },
    { name: 'Documents', path: '/dashboard/contractor/documents', icon: <FaFileAlt /> },
    { name: 'Tickets', path: '/dashboard/contractor/tickets', icon: <FaTicketAlt /> },
    { name: 'Payments', path: '/dashboard/contractor/payments', icon: <FaHome /> },
    { name: 'Notifications', path: '/dashboard/contractor/notifications', icon: <FaBell /> },
    { name: 'Support', path: '/dashboard/contractor/support', icon: <FaBell /> },
    { name: 'ChangeRequest', path: '/dashboard/contractor/my-change-requests', icon: <FaBell /> },
    { name: 'Contract Status', path: '/dashboard/contractor/contractor-pay', icon: <FaHome /> },
    { name: 'Contacts', path: '/dashboard/contractor/support', icon: <FaBell /> },
  ];

  const renderNavLinks = (links: NavLinkItem[]) =>
    links.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) =>
          `flex items-center p-2 my-1 rounded-md text-[12px] font-medium transition-colors duration-150 ${
            isActive
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-100 hover:bg-teal-300 hover:bg-opacity-60'
          }`
        }
      >
        <span className="mr-3">{link.icon}</span>
        <span>{link.name}</span>
      </NavLink>
    ));

  return (
    <>
      {isOpen && (
        <div
          className="relative inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`
           fixed inset-y-0 left-0 w-56 bg-deepBlue-dark dark:bg-gray-700
          shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-in-out z-50 md:translate-x-0 md:static
          before:content-[''] before:absolute before:inset-0
          before:bg-[url('../../assets/images/star.svg')] before:bg-repeat before:bg-[length:20px_20px]
          before:animate-twinkle before:pointer-events-none before:z-0
          dark:before:bg-[url('../../assets/images/star-pattern-dark.svg')]
        `}
      >
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>

        <div className="relative z-20 flex flex-col h-full">
          {/* Header / Logo */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-t
           from-teal-600 via-cyan-900 to-gray-900 
            dark:bg-gray-500 bg-opacity-50 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <NavLink to="/" className="text-white hover:text-gray-300">
                <FaHome size={20} />
              </NavLink>
              <div className="text-white tracking-wider">
                LogaXP
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden focus:outline-none"
              aria-label="Close Sidebar"
            >
              <svg
                className="w-6 h-6 text-white hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        
           {/* Navigation */}
           <nav className="mt-4 flex-1 overflow-y-auto px-3">
            {/* Conditionally Render Main Section */}
            {currentUser?.role !== 'contractor' && (
              <>
                <h3 className="text-gray-300 text-xs uppercase font-semibold tracking-wider mb-2">Main</h3>
                <div className="border-t border-gray-50 mb-4"></div>
                {renderNavLinks(navLinks)}
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <h3 className="text-gray-300 text-xs uppercase font-semibold tracking-wider mt-4 mb-2">
                  Admin Section
                </h3>
                <div className="border-t border-gray-50"></div>
                {renderNavLinks(adminLinks)}
              </>
            )}

            {currentUser?.role === 'user' && (
              <>
                <h3 className="text-gray-300 text-xs uppercase font-semibold tracking-wider mt-4 mb-2">
                  User Section
                </h3>
                <div className="border-t border-gray-50"></div>
                {renderNavLinks(userLinks)}
              </>
            )}

            {currentUser?.role === 'contractor' && (
            <>
            {/* Contractor Section Header */}
            <div className="mt-4 px-4 py-3 bg-gray-700  text-white dark:bg-gray-700 rounded-lg shadow-sm">
              <h3 className="text-white dark:text-teal-300  text-sm font-bold uppercase tracking-wide">
                Contractor Hub
              </h3>
              <div className="border-t border-lemonGreen-light  mt-4 mb-4"></div>
              <p className="text-gray-50 dark:text-gray-50 text-xs mt-1 leading-relaxed">
                Manage and oversee all contractor-related activities, agreements, and
                resources. This section ensures seamless collaboration and compliance.
              </p>
            </div>
          
            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-gray-700 mt-4 mb-4"></div>
          
            {/* Contractor Links */}
            <div className="space-y-2">
              {renderNavLinks(contractorLinks)}
            </div>
          </>
          
            )}
          </nav>


        {/* Footer / Logout */}
        <div className="flex-shrink-0 p-3 border-t border-gray-600 bg-gradient-to-t from-teal-600 via-cyan-900 to-cyan-900 dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 rounded-md text-sm font-medium text-gray-100 hover:bg-red-500 hover:text-white transition-colors duration-150"
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
