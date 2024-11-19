import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import AdminUser from './AdminUser';
import UploadInvite from './UploadInvite';
import AllApprovalRequests from '../../components/AllApprovalRequests';
import AppraisalList from '../../components/Appraisal/ApprovalRequestList';
import AdminAppraisalPeriods from '../../components/Appraisal/AdminAppraisalPeriods';
import Reports from '../../components/Appraisal/AdminReports';
import DeletionRequests from '../../components/UserList/DeletionRequests';
import Login from '../../components/LoggedInUsersList';
import { FaUser, FaUsers, FaTrashAlt, FaUpload, FaCheckCircle, FaList, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

const Admin: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<string>('AdminList');

  const isAdmin = user?.role === 'admin';

  // Tabs configuration with icons and labels
  const tabs = useMemo(
    () => [
      { label: 'Admin List', id: 'AdminList', icon: <FaUsers />, component: <AdminUser /> },
      { label: 'Login User', id: 'LoginUser', icon: <FaUser />, component: <Login /> },
      { label: 'Deletion ', id: 'DeletionRequest', icon: <FaTrashAlt />, component: <DeletionRequests /> },
      { label: 'Upload Users', id: 'UploadUsers', icon: <FaUpload />, component: <UploadInvite /> },
      { label: 'Approvals', id: 'Approvals', icon: <FaCheckCircle />, component: <AllApprovalRequests /> },
      { label: 'Appraisal List', id: 'AppraisalList', icon: <FaList />, component: <AppraisalList /> },
      { label: 'Appraisal Periods', id: 'AppraisalPeriods', icon: <FaCalendarAlt />, component: <AdminAppraisalPeriods /> },
      { label: 'Reports', id: 'Reports', icon: <FaChartBar />, component: <Reports /> },
    ],
    []
  );

  if (!isAdmin) {
    return (
      <div className="text-center mt-10 text-red-500">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full  p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 font-primary">
            Admin Panel
          </h2>
        </div>

        {/* Tabs with Icons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-primary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
