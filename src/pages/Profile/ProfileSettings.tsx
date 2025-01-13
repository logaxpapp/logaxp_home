import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Profile from './Profile';
import SecuritySettings from './Security';
import NotificationsSettings from './Notifications';
import DeletionRequests from '../../components/UserList/DeletionRequests';
import AccountDeletionRequest from '../../components/UserList/DeleteAccountButton';
import AdminChangeRequestsDashboard from '../../components/changeRequest/AdminChangeRequestsDashboard';
import DeletedChangeRequestsDashboard from '../../components/changeRequest/DeletedChangeRequests';
import CreateChangeRequestForm from '../../components/changeRequest/CreateChangeRequestForm';
import { FaTrash, FaPlus } from 'react-icons/fa';

const ProfileSetting: React.FC = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Profile
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Account Deletion
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              Deletion Requests
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-purple-50 hover:bg-gray-200 rounded-t-md">
              Security
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-teal-50 hover:bg-gray-200 rounded-t-md">
              Notifications
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-50 hover:bg-gray-200 rounded-t-md">
              Change Requests
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-pink-50 hover:bg-gray-200 rounded-t-md">
              <FaTrash className="inline-block mr-1 mb-1 text-red-500" />
               Change Requests
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-indigo-50 hover:bg-gray-200 rounded-t-md">
              <FaPlus className="inline-block mr-1 mb-1 text-indigo-500" />
              Change Request
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <Profile />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <AccountDeletionRequest />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <DeletionRequests />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SecuritySettings />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <NotificationsSettings />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <AdminChangeRequestsDashboard />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <DeletedChangeRequestsDashboard />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <CreateChangeRequestForm />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSetting;
