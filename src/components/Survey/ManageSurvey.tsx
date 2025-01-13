import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaTasks } from 'react-icons/fa';
import SurveyList from './SurveyList'; // Component for managing surveys
import SurveyAssignments from './AssignSurvey'; // Placeholder for assignments component
import SurveyResponses from './SurveyResponses'; // Placeholder for responses component
import SurveyResponsesList from './SurveyResponsesList'; // Placeholder for response list component
import Button from '../../components/common/Button/Button';


const ManageSurvey: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  // Mock Data for Overview Section
  const mockSurveyData = {
    totalSurveys: 25,
    assignedSurveys: 15,
    completedSurveys: 10,
    pendingResponses: 5,
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">

        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Survey Management</h2>
          <Button
            variant="success"
            onClick={() => console.log('Navigate to create survey page')}
            className="flex items-center mt-4 md:mt-0"
          >
            <FaTasks className="mr-2" /> Create Survey
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md">
              Overview
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Survey Management
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Assignments
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              Responses
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md">
              Response List
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
                <h2 className="text-lg font-medium text-green-700">Assigned Surveys</h2>
                <p className="text-3xl font-bold text-green-900">{mockSurveyData.assignedSurveys}</p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-yellow-700">Completed Surveys</h2>
                <p className="text-3xl font-bold text-yellow-900">{mockSurveyData.completedSurveys}</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-red-700">Pending Responses</h2>
                <p className="text-3xl font-bold text-red-900">{mockSurveyData.pendingResponses}</p>
              </div>
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SurveyList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SurveyAssignments />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SurveyResponses />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <SurveyResponsesList />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageSurvey;
