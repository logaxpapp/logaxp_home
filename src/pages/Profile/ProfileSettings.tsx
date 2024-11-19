import React, { useState } from 'react';
import Profile from './Profile';
import SecuritySettings from './Security';
import NotificationsSettings from './Notifications';
import DeletionRequests from '../../components/UserList/DeletionRequests';
import AccountDeletionRequest from '../../components/UserList/DeleteAccountButton';
import { FaUser, FaTrashAlt, FaShieldAlt, FaBell } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';

enum ProfileSettingView {
  PROFILE = 'Profile',
  ACCOUNT_DELETION = 'Account Deletion',
  DELETION_REQUESTS = 'Deletion Requests',
  SECURITY = 'Security',
  NOTIFICATIONS = 'Notifications',
}

const ProfileSetting: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfileSettingView>(ProfileSettingView.PROFILE);

  const renderCurrentView = () => {
    switch (currentView) {
      case ProfileSettingView.PROFILE:
        return <Profile />;
      case ProfileSettingView.ACCOUNT_DELETION:
        return <AccountDeletionRequest />;
      case ProfileSettingView.DELETION_REQUESTS:
        return <DeletionRequests />;
      case ProfileSettingView.SECURITY:
        return <SecuritySettings />;
      case ProfileSettingView.NOTIFICATIONS:
        return <NotificationsSettings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 px-4 md:px-8">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 mb-6 space-y-4 md:space-y-0 bg-gray-50 p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-white text-center md:text-left font-primary">
            Settings
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <Button
            variant={currentView === ProfileSettingView.PROFILE ? 'primary' : 'outline'}
            onClick={() => setCurrentView(ProfileSettingView.PROFILE)}
            leftIcon={<FaUser />}
            className="w-full md:w-auto"
          >
            Profile
          </Button>
          <Button
            variant={currentView === ProfileSettingView.ACCOUNT_DELETION ? 'primary' : 'outline'}
            onClick={() => setCurrentView(ProfileSettingView.ACCOUNT_DELETION)}
            leftIcon={<FaTrashAlt />}
            className="w-full md:w-auto"
          >
            Account Deletion
          </Button>
          <Button
            variant={currentView === ProfileSettingView.DELETION_REQUESTS ? 'primary' : 'outline'}
            onClick={() => setCurrentView(ProfileSettingView.DELETION_REQUESTS)}
            leftIcon={<FaTrashAlt />}
            className="w-full md:w-auto"
          >
            Deletion Requests
          </Button>
          <Button
            variant={currentView === ProfileSettingView.SECURITY ? 'primary' : 'outline'}
            onClick={() => setCurrentView(ProfileSettingView.SECURITY)}
            leftIcon={<FaShieldAlt />}
            className="w-full md:w-auto"
          >
            Security
          </Button>
          <Button
            variant={currentView === ProfileSettingView.NOTIFICATIONS ? 'primary' : 'outline'}
            onClick={() => setCurrentView(ProfileSettingView.NOTIFICATIONS)}
            leftIcon={<FaBell />}
            className="w-full md:w-auto"
          >
            Notifications
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
