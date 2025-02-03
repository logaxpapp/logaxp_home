// src/features/testManager/ApplicationList.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ApplicationListProps {
  onSelectApp?: (appName: string) => void;
}

// Example set of known apps:
const KNOWN_APPS = [
  'GatherPlux',
  'BookMiz',
  'BeautyHub',
  'TimeSync',
  'TaskBrick',
  'ProFixer',
  'DocSend',
  'LogaXP',
  'CashVent',
];

const ApplicationList: React.FC<ApplicationListProps> = ({ onSelectApp }) => {
  const handleClick = (appName: string) => {
    if (onSelectApp) onSelectApp(appName);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Available Applications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {KNOWN_APPS.map((app) => (
          <motion.div
            key={app}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition hover:bg-green-50"
            onClick={() => handleClick(app)}
          >
            <h2 className="text-lg font-semibold text-blue-600">{app}</h2>
            <p className="text-sm text-gray-600 mt-2">
              Click to view test cases for <strong>{app}</strong>.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;
