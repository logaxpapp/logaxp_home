// src/pages/test/TestManagement.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationList from './ApplicationList';
import TestManager from './TestManager';
import RequirementManager from './RequirementManager';
import AdminShareTestCasesForm from './AdminShareTestCasesForm';
import TestAnalysisPage from './TestAnalysisPage';
import TestCaseCreatedOrAssignedToMe from './TestCaseCreatedOrAssignedToMe';

// Tabs configuration
const TABS = [
  'Applications',
  'Test Manager',
  'Test Analysis',
  'Requirement',
  'ShareTestCases',
  'MyTestCase',
];

const TestManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [selectedApp, setSelectedApp] = useState<string | undefined>();
  const [selectedEnv, setSelectedEnv] = useState<
    'development' | 'staging' | 'production' | undefined
  >();

  const handleSelectApp = (appName: string) => {
    setSelectedApp(appName);
    setActiveTab('Test Manager');
  };

  const handleEnvChange = (
    newEnv: 'development' | 'staging' | 'production' | undefined
  ) => {
    setSelectedEnv(newEnv);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* --- Top Wave Divider (Rotated) --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Management</h1>

        {/* Responsive Tabs + Environment Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          {/* Tabs for larger screens */}
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Environment:</span>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm sm:text-base"
              value={selectedEnv || ''}
              onChange={(e) =>
                handleEnvChange(
                  e.target.value
                    ? (e.target.value as 'development' | 'staging' | 'production')
                    : undefined
                )
              }
            >
              <option value="">(Any)</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'Applications' && (
            <motion.div
              key="ApplicationsTab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ApplicationList onSelectApp={handleSelectApp} />
            </motion.div>
          )}

          {activeTab === 'Test Manager' && (
            <motion.div
              key="TestManagerTab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TestManager application={selectedApp} environment={selectedEnv} />
            </motion.div>
          )}

          {activeTab === 'Test Analysis' && (
            <motion.div
              key="TestAnalysisTab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TestAnalysisPage />
            </motion.div>
          )}

          {activeTab === 'Requirement' && (
            <motion.div
              key="RequirementManagerTab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RequirementManager />
            </motion.div>
          )}

          {activeTab === 'ShareTestCases' && (
            <motion.div
              key="ShareTestCasesTab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminShareTestCasesForm />
            </motion.div>
          )}

          {activeTab === 'MyTestCase' && (
            <motion.div
              key="MyTestCaseTab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TestCaseCreatedOrAssignedToMe />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TestManagement;
