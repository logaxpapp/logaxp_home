import React from 'react';
import { FaTicketAlt, FaExternalLinkAlt } from 'react-icons/fa';
import ClockInOutForm from '../../components/Time/ClockInForm';
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const featureCards = [
    { name: 'Total Tickets', value: 200, icon: <FaTicketAlt />, path: '/dashboard/tickets' },
    { name: 'Pending Survey', value: 45, icon: <FaTicketAlt />, path: '/dashboard/surveys' },
    { name: 'Approvals Needed', value: 200, icon: <FaTicketAlt />, path: '/dashboard/approvals' },
    { name: 'Tickets', icon: <FaTicketAlt />, path: '/dashboard/tickets' },
    { name: 'Survey', icon: <FaTicketAlt />, path: '/dashboard/surveys' },
    { name: 'Approvals', icon: <FaTicketAlt />, path: '/dashboard/approvals' },
    { name: 'Requests', icon: <FaTicketAlt />, path: '/dashboard/requests' },
    { name: 'Resources', icon: <FaTicketAlt />, path: '/dashboard/resources' },
    { name: 'Incidence', icon: <FaTicketAlt />, path: '/dashboard/incidents' },
    { name: 'Scheduling', icon: <FaTicketAlt />, path: '/dashboard/scheduling' },
    { name: 'Attendance', icon: <FaTicketAlt />, path: '/dashboard/attendance' },
    { name: 'Notifications', icon: <FaTicketAlt />, path: '/dashboard/notifications' },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800">
    {/* Header Section */}
        <div className="p-5 bg-gradient-to-r from-lime-100 via-lime-200 to-lime-300 rounded-3xl shadow-2xl max-w-7xl mx-auto mb-16 transform hover:scale-105 transition-transform duration-300">
      <ClockInOutForm />
    </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto ">
        {featureCards.slice(0, 3).map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 hover:shadow-lg transition-transform duration-200 flex items-center justify-between relative group transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 font-primary">
              <div className="p-4 bg-lemonGreen-light  rounded-lg shadow text-white">
                {feature.icon}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700 group-hover:text-green-500 transition-colors">
                  {feature.name}
                </h2>
                <p className="text-2xl font-bold text-gray-900">{feature.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto font-primary">
        {featureCards.slice(3).map((feature, index) => (
          <Link
            to={feature.path}
            key={index}
            className="block bg-white rounded-xl p-4 hover:shadow-xl transition-transform duration-200 group relative transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-deepBlue-dark rounded-lg shadow text-white">
                  {feature.icon}
                </div>
                <h2 className="text-lg font-medium text-deepBlue group-hover:text-deepBlue-lighter transition-colors">
                  {feature.name}
                </h2>
              </div>
              <div className="p-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-lg text-gray-700">
                <FaExternalLinkAlt />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
