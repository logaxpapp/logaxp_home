import React, { useState } from 'react';
import Profile from './Profile';
import SecuritySettings from './Security';
import NotificationsSettings from './Notifications';
import DeletionRequests from '../../components/UserList/DeletionRequests';
import AccountDeletionRequest from '../../components/UserList/DeleteAccountButton';
import {
  FaUser,
  FaTrashAlt,
  FaShieldAlt,
  FaBell,
  FaPlus
} from 'react-icons/fa';
import AdminChangeRequestsDashboard from '../../components/changeRequest/AdminChangeRequestsDashboard';
import DeletedChangeRequestsDashboard from '../../components/changeRequest/DeletedChangeRequests';
import CreateChangeRequestForm from '../../components/changeRequest/CreateChangeRequestForm';

const ProfileSetting: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('Profile');

  const renderCurrentView = (key: string) => {
    switch (key) {
      case 'Profile':
        return <Profile />;
      case 'Account Deletion':
        return <AccountDeletionRequest />;
      case 'Deletion Requests':
        return <DeletionRequests />;
      case 'Security':
        return <SecuritySettings />;
      case 'Notifications':
        return <NotificationsSettings />;
      case 'Admin Change Requests':
        return <AdminChangeRequestsDashboard />;
      case 'Deleted Change Requests':
        return <DeletedChangeRequestsDashboard />;
      case 'Create Change Request':
        return <CreateChangeRequestForm />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 px-4 md:px-8">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-blue-800 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Manage your account settings, security, and preferences here.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {[
            { key: 'Profile', label: 'Profile', icon: <FaUser /> },
            { key: 'Account Deletion', label: 'Account Deletion', icon: <FaTrashAlt /> },
            { key: 'Deletion Requests', label: 'Deletion Requests', icon: <FaTrashAlt /> },
            { key: 'Security', label: 'Security', icon: <FaShieldAlt /> },
            { key: 'Notifications', label: 'Notifications', icon: <FaBell /> },
            { key: 'Admin Change Requests', label: 'Manage Change Req', icon: <FaShieldAlt /> },
            { key: 'Deleted Change Requests', label: 'Change Requests', icon: <FaTrashAlt /> },
            { key: 'Change Request', label: ' Change Request', icon: <FaPlus /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === tab.key
                  ? 'bg-lemonGreen-light text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
          {renderCurrentView(currentTab)}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
