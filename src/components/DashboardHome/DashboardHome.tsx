import React, { useState } from 'react';
import { 
  FaTicketAlt, 
  FaSass, 
  FaClipboardCheck, 
  FaClipboardList, 
  FaBookOpen, 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaClock, 
  FaBell, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  // States to toggle dropdowns
  const [isTicketDropdownOpen, setTicketDropdownOpen] = useState(false);
  const [isSurveyDropdownOpen, setSurveyDropdownOpen] = useState(false);
  const [isApprovalDropdownOpen, setApprovalDropdownOpen] = useState(false);

  const featureCards = [
    { name: 'Tickets', icon: <FaTicketAlt />, path: '/dashboard/tickets' },
    { name: 'Surveys', icon: <FaSass />, path: '/dashboard/surveys' },
    { name: 'Approvals', icon: <FaClipboardCheck />, path: '/dashboard/approvals' },
    { name: 'Requests', icon: <FaClipboardList />, path: '/dashboard/requests' },
    { name: 'Resources', icon: <FaBookOpen />, path: '/dashboard/resources' },
    { name: 'Incidents', icon: <FaExclamationTriangle />, path: '/dashboard/incidents' },
    { name: 'Scheduling', icon: <FaCalendarAlt />, path: '/dashboard/scheduling' },
    { name: 'Attendance', icon: <FaClock />, path: '/dashboard/attendance' },
    { name: 'Notifications', icon: <FaBell />, path: '/dashboard/notifications' },
  ];

  // Example summary data (replace with actual data)
  const summaryData = {
    totalTickets: 120,
    pendingSurveys: 45,
    approvalsNeeded: 30,
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-cyan-700 dark:text-white mb-10 text-center">
        Welcome to the Employee Service Center
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
        {/* Total Tickets Card with Independent Dropdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200 flex flex-col relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTicketAlt size={50} className="text-green-500 mr-6" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Total Tickets</h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{summaryData.totalTickets}</p>
              </div>
            </div>
            <button
              onClick={() => setTicketDropdownOpen(!isTicketDropdownOpen)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              {isTicketDropdownOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </button>
          </div>
          {isTicketDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-10">
              {/* Dropdown content for tickets */}
              <p className="text-sm text-gray-700 dark:text-gray-300">Open: 50</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Closed: 70</p>
            </div>
          )}
        </div>

        {/* Pending Surveys Card with Independent Dropdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200 flex flex-col relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaSass size={50} className="text-pink-500 mr-6" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Pending Surveys</h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{summaryData.pendingSurveys}</p>
              </div>
            </div>
            <button
              onClick={() => setSurveyDropdownOpen(!isSurveyDropdownOpen)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              {isSurveyDropdownOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </button>
          </div>
          {isSurveyDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-10">
              {/* Dropdown content for surveys */}
              <p className="text-sm text-gray-700 dark:text-gray-300">Active: 20</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Inactive: 25</p>
            </div>
          )}
        </div>

        {/* Approvals Needed Card with Independent Dropdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200 flex flex-col relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaClipboardCheck size={50} className="text-yellow-500 mr-6" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Approvals Needed</h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{summaryData.approvalsNeeded}</p>
              </div>
            </div>
            <button
              onClick={() => setApprovalDropdownOpen(!isApprovalDropdownOpen)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              {isApprovalDropdownOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </button>
          </div>
          {isApprovalDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-10">
              {/* Dropdown content for approvals */}
              <p className="text-sm text-gray-700 dark:text-gray-300">Approved: 15</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Pending: 15</p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {featureCards.map((feature) => (
          <Link 
            to={feature.path} 
            key={feature.name} 
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 hover:shadow-2xl transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-800 group"
          >
            <div className="flex items-center justify-center mb-4 text-green-500 dark:text-green-400 group-hover:text-green-700">
              {React.cloneElement(feature.icon, { size: 30 })}
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-200">
              {feature.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
