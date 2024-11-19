import React, { useState } from 'react';
import {
  FaUsers,
  FaUserPlus,
  FaUserShield,
  FaKey,
  FaCogs,
} from 'react-icons/fa';
import UserList from './UserList/UserList';
import SettingsManagement from './Settings/SettingsManagement';
import RolesManagement from './Roles/RolesManagement';
import Button from '../components/common/Button/Button';
import Modal from '../components/common/Feedback/Modal';
import CreateEditUserForm from './UserList/CreateUserForm';
import PermissionsManagement from './Permissions/PermissionsManagement';

enum UserManagementView {
  Users = 'Users',
  Roles = 'Roles',
  Permissions = 'Permissions',
  Settings = 'Settings',
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
      default:
        return <UserList />;
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 font-primary mb-2 sm:mb-0">
            User Management
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.values(UserManagementView).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as UserManagementView)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-md transition-colors duration-200 font-secondary text-sm sm:text-base ${
                  currentView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {view === UserManagementView.Users && <FaUsers />}
                {view === UserManagementView.Roles && <FaUserShield />}
                {view === UserManagementView.Permissions && <FaKey />}
                {view === UserManagementView.Settings && <FaCogs />}
                <span>{view}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {currentView === UserManagementView.Users && (
          <div className="flex justify-end px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900">
            <Button
              variant="primary"
              leftIcon={<FaUserPlus />}
              onClick={() => setCreateUserModalOpen(true)}
            >
              Create User
            </Button>
          </div>
        )}

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
