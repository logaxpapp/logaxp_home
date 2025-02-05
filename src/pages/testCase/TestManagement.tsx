import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationList from './ApplicationList';
import TestManager from './TestManager';
import RequirementManager from './RequirementManager';
import AdminShareTestCasesForm from './AdminShareTestCasesForm';
import TestAnalysisPage from './TestAnalysisPage';

// Tabs configuration
const TABS = ['Applications', 'Test Manager', 'Test Analysis', 'Requirement', 'ShareTestCases'];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Management</h1>

      {/* Responsive Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        {/* Tabs for larger screens */}
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide mb-4 sm:mb-0">
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
            <option value="development">development</option>
            <option value="staging">staging</option>
            <option value="production">production</option>
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
      </AnimatePresence>
    </div>
  );
};

export default TestManagement;