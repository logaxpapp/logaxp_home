// "I want the vital message at all time."
// src/features/testManager/TestManagement.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationList from './ApplicationList';
import TestManager from './TestManager';

// Step 1: Import the new Analysis page
import TestAnalysisPage from './TestAnalysisPage';

// We now have 3 tabs:
const TABS = ['Applications', 'Test Manager', 'Test Analysis'];

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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Management</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex mb-4 space-x-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Environment Selector */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm text-gray-500">Environment:</span>
        <select
          className="border border-gray-300 rounded px-8 py-1"
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

        {/* Step 2: The new “Test Analysis” tab */}
        {activeTab === 'Test Analysis' && (
          <motion.div
            key="TestAnalysisTab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* The new TestAnalysisPage with Victory chart */}
            <TestAnalysisPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestManagement;
