import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaEnvelope, FaUserCheck, FaBan, FaPaperPlane } from 'react-icons/fa';
import AdminSendNewsletter from './AdminSendNewsletter';
import AdminSubscriptionList from './AdminSubscriptionList';
import ConfirmSubscription from './ConfirmSubscription';
import Unsubscribe from './Unsubscribe';

const ManageNewsletter: React.FC = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Manage Newsletter
          </h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-700">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaEnvelope className="inline mr-2" /> Subscriptions
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaPaperPlane className="inline mr-2" /> Send Newsletter
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaUserCheck className="inline mr-2" /> Confirm Subscription
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaBan className="inline mr-2" /> Unsubscribe
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AdminSubscriptionList />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AdminSendNewsletter />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ConfirmSubscription />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Unsubscribe />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageNewsletter;
