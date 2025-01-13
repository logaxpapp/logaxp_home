import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Appraisal from './Appraisal';
import ComingSoon from '../../pages/ComingSoon';

const AppraisalManagement: React.FC = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Appraisal Management</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Appraisals
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Templates
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              Reports
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              Insights
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <Appraisal />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ComingSoon />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ComingSoon />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ComingSoon />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default AppraisalManagement;
