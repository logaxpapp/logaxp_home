// src/components/Report/ReportPreview.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import AnimatedButton from '../../components/common/Button/AnimatedButton';

interface ReportPreviewProps {
  data: any;
  title: string;
  generatedAt: string;
  onExport: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ data, title, generatedAt, onExport }) => {
  return (
    <motion.div
      className="mt-8 p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">Generated At: {new Date(generatedAt).toLocaleString()}</p>
        </div>
        <AnimatedButton onClick={onExport} Icon={FiDownload} className="">
          Export
        </AnimatedButton>
      </div>
      <div className="mt-4 overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
};

export default ReportPreview;
