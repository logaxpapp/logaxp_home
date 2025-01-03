import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Admin: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);

  const isAdmin = user?.role === 'admin';

  // Tabs configuration
  const tabs = [
    { label: 'Admin List',  component: <AdminUser /> },
    { label: 'Login User', component: <Login /> },
    { label: 'Deletion Requests', component: <DeletionRequests /> },
    { label: 'Upload Users',  component: <UploadInvite /> },
    { label: 'Approvals',  component: <AllApprovalRequests /> },
    { label: 'Appraisal List',  component: <AppraisalList /> },
    { label: 'Appraisal Periods',  component: <AdminAppraisalPeriods /> },
    { label: 'Reports',  component: <Reports /> },
    { label: 'Audit Log',  component: <AuditLog /> },
    { label: 'Create Contractor',  component: <CreateContractorForm /> },
  ];

  if (!isAdmin) {
    return (
      <div className="text-center mt-10 text-red-500">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 min-h-screen bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
       

        {/* Tabs with Icons */}
        <Tabs>
          <TabList className="flex gap-4 p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className="flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer font-semibold text-gray-700 hover:text-gray-900 hover:bg-white underline border-gray-300"
                selectedClassName="bg-gradient-to-t from-teal-500 via-cyan-600 to-gray-700 text-white shadow-lg border-none"
              >
               
                <span className="hidden sm:inline">{tab.label}</span>
              </Tab>
            ))}
          </TabList>

          {/* Tab Panels */}
          {tabs.map((tab, index) => (
            <TabPanel key={index}>
              <div className="p-6 bg-gray-100">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  {tab.component}
                </div>
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
