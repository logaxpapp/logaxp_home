import React, { useState } from 'react';
import { FaClipboardList, FaClipboardCheck, FaChartPie, FaFileAlt } from 'react-icons/fa';
import MySurvey from './MySurvey';
import MySurveyResponses from './MySurveyResponses';

enum SurveyManagementView {
  MySurveys = 'My Surveys',
  CompletedSurveys = 'Completed Surveys',
  SurveyStatistics = 'Survey Statistics', // Fictitious component
  SurveyTemplates = 'Survey Templates',   // Fictitious component
}

const MySurveyList: React.FC = () => {
  const [currentView, setCurrentView] = useState<SurveyManagementView>(SurveyManagementView.MySurveys);

  return (
    <div className="mx-auto p-6 font-secondary">
      <div className="bg-white min-h-screen dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Survey Management</h2>
          <div className="text-gray-500 dark:text-gray-400 flex space-x-4">
            {Object.values(SurveyManagementView).map((view) => (
              <button
                key={view}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md focus:outline-none transition-colors duration-200 ${
                  currentView === view
                    ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCurrentView(view)}
              >
                {view === SurveyManagementView.MySurveys && <FaClipboardList />}
                {view === SurveyManagementView.CompletedSurveys && <FaClipboardCheck />}
                {view === SurveyManagementView.SurveyStatistics && <FaChartPie />}
                {view === SurveyManagementView.SurveyTemplates && <FaFileAlt />}
                <span>{view}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          {/* My Surveys View */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            style={{
              transition: 'all 0.3s ease',
              transform: currentView === SurveyManagementView.MySurveys ? 'scale(1)' : 'scale(0.95)',
              opacity: currentView === SurveyManagementView.MySurveys ? 1 : 0,
              display: currentView === SurveyManagementView.MySurveys ? 'block' : 'none',
            }}
          >
            <MySurvey />
          </div>

          {/* Completed Surveys View */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            style={{
              transition: 'all 0.3s ease',
              transform: currentView === SurveyManagementView.CompletedSurveys ? 'scale(1)' : 'scale(0.95)',
              opacity: currentView === SurveyManagementView.CompletedSurveys ? 1 : 0,
              display: currentView === SurveyManagementView.CompletedSurveys ? 'block' : 'none',
            }}
          >
            <MySurveyResponses />
          </div>

          {/* Survey Statistics View - Fictitious */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            style={{
              transition: 'all 0.3s ease',
              transform: currentView === SurveyManagementView.SurveyStatistics ? 'scale(1)' : 'scale(0.95)',
              opacity: currentView === SurveyManagementView.SurveyStatistics ? 1 : 0,
              display: currentView === SurveyManagementView.SurveyStatistics ? 'block' : 'none',
            }}
          >
            <p className="text-lg text-gray-700">Survey Statistics Component</p>
            {/* Add SurveyStatistics component here when available */}
          </div>

          {/* Survey Templates View - Fictitious */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            style={{
              transition: 'all 0.3s ease',
              transform: currentView === SurveyManagementView.SurveyTemplates ? 'scale(1)' : 'scale(0.95)',
              opacity: currentView === SurveyManagementView.SurveyTemplates ? 1 : 0,
              display: currentView === SurveyManagementView.SurveyTemplates ? 'block' : 'none',
            }}
          >
            <p className="text-lg text-gray-700">Survey Templates Component</p>
            {/* Add SurveyTemplates component here when available */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySurveyList;
