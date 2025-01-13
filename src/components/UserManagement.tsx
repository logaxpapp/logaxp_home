import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UserList from './UserList/UserList';
import SettingsManagement from './Settings/SettingsManagement';
import RolesManagement from './Roles/RolesManagement';
import Modal from '../components/common/Feedback/Modal';
import CreateEditUserForm from './UserList/CreateUserForm';
import PermissionsManagement from './Permissions/PermissionsManagement';
import MyChangeRequests from './changeRequest/MyChangeRequest';
import Articles from '../components/Article/AdminArticleList';

const UserManagement: React.FC = () => {
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          <button
            onClick={() => setCreateUserModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            + Add User
          </button>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 px-4 py-2">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Users
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Roles
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              Permissions
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              Settings
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-purple-50 hover:bg-gray-200 rounded-t-md">
              My Change Requests
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md">
              Articles
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <UserList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <RolesManagement />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <PermissionsManagement />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SettingsManagement />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <MyChangeRequests />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <Articles />
          </TabPanel>
        </Tabs>
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Create New User"
      >
        <CreateEditUserForm
          user={null} // Null indicates creation, not editing
          onClose={() => setCreateUserModalOpen(false)}
          onSuccess={() => setCreateUserModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
