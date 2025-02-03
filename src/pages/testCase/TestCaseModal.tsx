// "I want the vital message at all time."
// src/features/testManager/TestCaseModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ITestCase } from '../../types/testCase';
import OverviewTab from './OverviewTab';
import StepsTab from './StepsTab';
import ExecutionsTab from './ExecutionsTab';
import AssignTab from './AssignTab';
import AttachmentsTab from './AttachmentsTab';
import VersionsTab from './VersionsTab';

// Icons
import { FaTimes, FaList, FaPlayCircle, FaUser, FaInfoCircle, FaPaperclip, FaHistory } from 'react-icons/fa';

interface TestCaseModalProps {
  testCase: ITestCase;
  onClose: () => void;
}

const TABS = [
  { name: 'Overview', icon: <FaInfoCircle className="mr-2" /> },
  { name: 'Steps', icon: <FaList className="mr-2" /> },
  { name: 'Executions', icon: <FaPlayCircle className="mr-2" /> },
  { name: 'Assign', icon: <FaUser className="mr-2" /> },
  { name: 'Attachments', icon: <FaPaperclip className="mr-2" /> },
  { name: 'Versions', icon: <FaHistory className="mr-2" /> },
];

const TestCaseModal: React.FC<TestCaseModalProps> = ({ testCase, onClose }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].name);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 h-screen bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-2xl w-[90%] max-w-[800px] max-h-[90vh] overflow-auto mt-40"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Test Case: <span className="text-blue-600">{testCase.testId}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-gray-200 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.name}
                className={`flex items-center px-4 py-2 -mb-px transition-all ${
                  activeTab === tab.name
                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Render Active Tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Overview' && <OverviewTab testCase={testCase} />}
              {activeTab === 'Steps' && <StepsTab testCase={testCase} />}
              {activeTab === 'Executions' && <ExecutionsTab testCase={testCase} />}
              {activeTab === 'Assign' && <AssignTab testCaseId={testCase._id} />}
              {activeTab === 'Attachments' && <AttachmentsTab testCase={testCase} />}
              {activeTab === 'Versions' && <VersionsTab versions={testCase.versions} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TestCaseModal;
