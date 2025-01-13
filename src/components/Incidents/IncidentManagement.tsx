import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaList, FaClipboardCheck, FaFileAlt, FaExclamationCircle } from 'react-icons/fa';
import IncidentList from './IncidentList'; // Main Incident List Component
import ComingSoon from '../../pages/ComingSoon'; 

const IncidentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('IncidentList');

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">

        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Incident Management
          </h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              <FaList className="inline mr-2" /> Incident List
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              <FaClipboardCheck className="inline mr-2" /> Resolved Incidents
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              <FaFileAlt className="inline mr-2" /> Reports
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              <FaExclamationCircle className="inline mr-2" /> Escalations
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Incident List */}
            <IncidentList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Resolved Incidents (Fictitious Tab) */}
            <ComingSoon />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Reports (Fictitious Tab) */}
            <ComingSoon />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Escalations (Fictitious Tab) */}
            <ComingSoon />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default IncidentManagement;
