// "I want the vital message at all time."
// src/features/testManager/TestCaseModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ITestCase } from '../../types/testCase';

// Import your tabs
import OverviewTab from './OverviewTab';
import StepsTab from './StepsTab';
import ExecutionsTab from './ExecutionsTab';
import AssignTab from './AssignTab';
import AttachmentsTab from './AttachmentsTab';
import VersionsTab from './VersionsTab';
import RequirementsTab from './RequirementsTab';

// Icons
import {
  FaTimes,
  FaList,
  FaPlayCircle,
  FaUser,
  FaInfoCircle,
  FaPaperclip,
  FaHistory,
} from 'react-icons/fa';

/** The available tabs (name + icon). */
const TABS = [
  { name: 'Overview', icon: <FaInfoCircle className="mr-2" /> },
  { name: 'Steps', icon: <FaList className="mr-2" /> },
  { name: 'Executions', icon: <FaPlayCircle className="mr-2" /> },
  { name: 'Assign', icon: <FaUser className="mr-2" /> },
  { name: 'Attachments', icon: <FaPaperclip className="mr-2" /> },
  { name: 'Versions', icon: <FaHistory className="mr-2" /> },
  { name: 'Requirements', icon: <FaInfoCircle className="mr-2" /> },
];

interface TestCaseModalProps {
  testCase: ITestCase;
  onClose: () => void;
}

/**
 * A modern, responsive, animated modal for viewing/editing a TestCase.
 */
const TestCaseModal: React.FC<TestCaseModalProps> = ({ testCase, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].name);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          className="relative bg-white md:max-w-4xl w-[90%] md:w-auto max-h-[90vh] overflow-hidden rounded-xl shadow-lg flex flex-col"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <ModalHeader testId={testCase.testId} onClose={onClose} />

          {/* The tab bar */}
          <TabSelector tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Scrolling content area */}
          <div className="p-4 flex-1 overflow-auto bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveTab(activeTab, testCase)}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------ Modal Header ------------------ */
const ModalHeader: React.FC<{ testId: string; onClose: () => void }> = ({
  testId,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
      <h2 className="text-xl font-semibold text-white">
        Test Case: <span className="font-bold">{testId}</span>
      </h2>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 text-2xl transition-colors"
        aria-label="Close modal"
      >
        <FaTimes />
      </button>
    </div>
  );
};

/* ------------------ Tabs Bar ------------------ */
interface TabSelectorProps {
  tabs: { name: string; icon: JSX.Element }[];
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

/**
 * Renders a horizontal tab bar with nice hover/active styles.
 * On mobile, it remains horizontal but is scrollable if needed.
 */
const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto bg-white shadow-sm px-4 border-b border-gray-200 p-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative px-3 py-2 text-sm flex items-center whitespace-nowrap 
              transition-colors 
              ${
                isActive
                  ? 'text-blue-600 font-semibold border-b-4 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-4 border-transparent'
              }
            `}
          >
            {tab.icon}
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

/* ------------------ Tab Content Switch ------------------ */
function renderActiveTab(activeTab: string, testCase: ITestCase) {
  switch (activeTab) {
    case 'Overview':
      return <OverviewTab testCase={testCase} />;
    case 'Steps':
      return <StepsTab testCase={testCase} />;
    case 'Executions':
      return <ExecutionsTab testCase={testCase} />;
    case 'Assign':
      return <AssignTab testCaseId={testCase._id} />;
    case 'Attachments':
      return <AttachmentsTab testCase={testCase} />;
    case 'Versions':
      return <VersionsTab versions={testCase.versions} />;
    case 'Requirements':
      return <RequirementsTab testCase={testCase} />;
    default:
      return <OverviewTab testCase={testCase} />;
  }
}

export default TestCaseModal;
