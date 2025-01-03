import React, { useState } from 'react';
import UserList from './UserList/UserList';
import SettingsManagement from './Settings/SettingsManagement';
import RolesManagement from './Roles/RolesManagement';
import Modal from '../components/common/Feedback/Modal';
import CreateEditUserForm from './UserList/CreateUserForm';
import PermissionsManagement from './Permissions/PermissionsManagement';
import MyChangeRequests from './changeRequest/MyChangeRequest';
import Articles from '../components/Article/AdminArticleList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const UserManagement: React.FC = () => {
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

  // Tabs configuration
  const tabs = [
    { label: 'Users', component: <UserList /> },
    { label: 'Roles', component: <RolesManagement /> },
    { label: 'Permissions', component: <PermissionsManagement /> },
    { label: 'Settings', component: <SettingsManagement /> },
    { label: 'My Change Requests',  component: <MyChangeRequests /> },
    { label: 'Articles',  component: <Articles /> },
  ];

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        
        {/* Tabs with Icons */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 text-lg font-semibold bg-gray-50 dark:bg-gray-900 px-6 py-3 border-b border-gray-300 dark:border-gray-700">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className="cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-200 rounded-t-md hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 transition"
                selectedClassName="bg-gradient-to-t from-teal-500 via-cyan-600 to-gray-700 text-white  dark:bg-gray-800 text-black dark:text-white font-bold"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>

          {/* Tab Panels */}
          {tabs.map((tab, index) => (
            <TabPanel key={index}>
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg">
                {tab.component}
              </div>
            </TabPanel>
          ))}
        </Tabs>
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
