import React, { useState } from 'react';
import {
  FaUsers,
  FaUserPlus,
  FaUserShield,
  FaKey,
  FaCogs,
  FaNewspaper,
} from 'react-icons/fa';
import UserList from './UserList/UserList';
import SettingsManagement from './Settings/SettingsManagement';
import RolesManagement from './Roles/RolesManagement';
import Button from '../components/common/Button/Button';
import Modal from '../components/common/Feedback/Modal';
import CreateEditUserForm from './UserList/CreateUserForm';
import PermissionsManagement from './Permissions/PermissionsManagement';
import MyChangeRequests from './changeRequest/MyChangeRequest';
import Articles from '../components/Article/AdminArticleList';

enum UserManagementView {
  Users = 'Users',
  Roles = 'Roles',
  Permissions = 'Permissions',
  Settings = 'Settings',
  ChangeRequests = 'MyChange Requests',
  Articles = 'Articles',
}

const UserManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<UserManagementView>(UserManagementView.Users);
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

  // Render content based on the selected tab
  const renderView = () => {
    switch (currentView) {
      case UserManagementView.Users:
        return <UserList />;
      case UserManagementView.Roles:
        return <RolesManagement />;
      case UserManagementView.Permissions:
        return <PermissionsManagement />;
      case UserManagementView.Settings:
        return <SettingsManagement />;
      case UserManagementView.ChangeRequests:
        return <MyChangeRequests />;
      case UserManagementView.Articles:
        return <Articles />;
      default:
        return <UserList />;
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 font-primary mb-4">
            User Management
          </h2>

          <div className="flex flex-col gap-4">
            {/* Core Management Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: UserManagementView.Users, label: 'Users', icon: <FaUsers /> },
                { key: UserManagementView.Roles, label: 'Roles', icon: <FaUserShield /> },
                { key: UserManagementView.Permissions, label: 'Permissions', icon: <FaKey /> },
                { key: UserManagementView.Settings, label: 'Settings', icon: <FaCogs /> },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 font-secondary text-sm sm:text-base ${
                    currentView === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Special Actions Buttons */}
            <div className="flex flex-wrap gap-2 border-t pt-4 mt-4 border-gray-300 dark:border-gray-600">
              <h3 className="w-full text-gray-600 dark:text-gray-400 font-medium text-sm">
                Special Actions
              </h3>
              {[
                { key: UserManagementView.ChangeRequests, label: 'MyChange Requests', icon: <FaUserPlus /> },
                { key: UserManagementView.Articles, label: 'Manage Articles', icon: <FaNewspaper /> },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 font-secondary text-sm sm:text-base ${
                    currentView === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 transition-all duration-300">
          {renderView()}
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Create New User"
      >
        <CreateEditUserForm
          user={null} // null to indicate this is a creation, not editing
          onClose={() => setCreateUserModalOpen(false)}
          onSuccess={() => {
            setCreateUserModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
