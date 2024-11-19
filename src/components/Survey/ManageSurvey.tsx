import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTasks, FaList, FaChartBar, FaCog, FaPlus } from 'react-icons/fa';
import SurveyList from './SurveyList'; // Component for managing surveys
import SurveyAssignments from './AssignSurvey'; // Placeholder for assignments component
import SurveyResponses from './SurveyResponses'; // Placeholder for responses component
import SurveyResponsesList from './SurveyResponsesList'; // Placeholder for response list component
import Button from '../../components/common/Button/Button';

const ManageSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('SurveyManagement');

  // Define the tab configuration with icons, labels, and components
  const tabs = useMemo(
    () => [
      { label: 'Survey Management', id: 'SurveyManagement', icon: <FaList />, component: <SurveyList /> },
      { label: 'Assignments', id: 'Assignments', icon: <FaTasks />, component: <SurveyAssignments /> },
      { label: 'Responses', id: 'Responses', icon: <FaChartBar />, component: <SurveyResponses /> },
      { label: 'Response List', id: 'Settings', icon: <FaCog />, component: <SurveyResponsesList /> },
    ],
    []
  );

  return (
    <div className="mx-auto ">
      <div className="bg-white min-h-screen dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 text-center md:text-left font-primary">
            Survey Management
          </h2>
          <Button
            variant="success"
            onClick={() => navigate('/dashboard/surveys/create')}
            className="flex items-center mt-4 md:mt-0"
          >
            <FaPlus className="mr-2" /> Create Survey
          </Button>
        </div>

        {/* Tabs with Icons */}
        <div className="flex flex-wrap md:flex-nowrap font-primary space-x-2 p-4 bg-blue-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none transition-colors duration-200 mb-2 md:mb-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSurvey;
