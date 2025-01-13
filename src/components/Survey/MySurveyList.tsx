import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaClipboardList, FaClipboardCheck, FaChartPie, FaFileAlt } from 'react-icons/fa';
import MySurvey from './MySurvey';
import MySurveyResponses from './MySurveyResponses';
import ComingSoon from '../../pages/ComingSoon';

const MySurveyList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  // Mock Data for Overview Section
  const mockSurveyData = {
    totalSurveys: 30,
    completedSurveys: 20,
    pendingSurveys: 10,
    templates: 5,
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">

        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Survey Management</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md">
              <FaClipboardList className="inline mr-2" /> Overview
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              <FaClipboardCheck className="inline mr-2" /> My Surveys
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              <FaChartPie className="inline mr-2" /> Completed Surveys
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              <FaFileAlt className="inline mr-2" /> Templates
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Overview Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-blue-700">Total Surveys</h2>
                <p className="text-3xl font-bold text-blue-900">{mockSurveyData.totalSurveys}</p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-green-700">Completed Surveys</h2>
                <p className="text-3xl font-bold text-green-900">{mockSurveyData.completedSurveys}</p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-yellow-700">Pending Surveys</h2>
                <p className="text-3xl font-bold text-yellow-900">{mockSurveyData.pendingSurveys}</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-red-700">Templates</h2>
                <p className="text-3xl font-bold text-red-900">{mockSurveyData.templates}</p>
              </div>
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <MySurvey />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <MySurveyResponses />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ComingSoon />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default MySurveyList;
