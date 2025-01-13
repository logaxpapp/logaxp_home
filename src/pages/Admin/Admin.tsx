import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaUsers, FaLock, FaUpload, FaClipboardCheck, FaFileAlt, FaChartBar, FaTrashAlt, FaUserShield } from 'react-icons/fa';
import AdminUser from './AdminUser';
import CreateContractorForm from './CreateContractorForm';
import UploadInvite from './UploadInvite';
import AllApprovalRequests from '../../components/AllApprovalRequests';
import AppraisalList from '../../components/Appraisal/ApprovalRequestList';
import AdminAppraisalPeriods from '../../components/Appraisal/AdminAppraisalPeriods';
import Reports from '../../components/Appraisal/AdminReports';
import DeletionRequests from '../../components/UserList/DeletionRequests';
import AuditLog from '../../components/Audit/AuditLog';
import Login from '../../components/LoggedInUsersList';

const Admin: React.FC = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Admin Management
          </h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-700">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Admin List
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
             Login User
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-100 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Deletion Requests
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-purple-100 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
               Upload Users
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-teal-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
               Approvals
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-pink-100 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
               Appraisal List
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-pink-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
               Appraisal Periods
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-indigo-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
               Reports
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
             Audit Log
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-orange-50 hover:bg-gray-200 rounded-t-md text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Contractor
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AdminUser />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Login />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <DeletionRequests />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <UploadInvite />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AllApprovalRequests />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AppraisalList />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AdminAppraisalPeriods />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Reports />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AuditLog />
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <CreateContractorForm />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
