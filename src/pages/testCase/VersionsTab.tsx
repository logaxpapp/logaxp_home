// "I want the vital message at all time."
// src/features/testManager/modals/tabs/VersionsTab.tsx

import React from 'react';
import { ITestCaseVersion } from '../../types/testCase';

interface VersionsTabProps {
  versions?: ITestCaseVersion[];
}

const VersionsTab: React.FC<VersionsTabProps> = ({ versions }) => {
  if (!versions || versions.length === 0) {
    return <p className="text-gray-500">No version history available.</p>;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">Version History</h4>

      {versions.map((ver) => (
        <div
          key={ver.versionNumber}
          className="border p-3 rounded bg-gray-50 mb-2"
        >
          <div className="text-sm text-gray-800">
            <strong>Version:</strong> {ver.versionNumber}
          </div>

          <div className="text-sm text-gray-800">
            <strong>Updated By:</strong>{' '}
            {typeof ver.updatedBy === 'object'
              ? ver.updatedBy.name 
              : ver.updatedBy}    
          </div>

          <div className="text-sm text-gray-800">
            <strong>Date:</strong> {new Date(ver.updatedAt).toLocaleString()}
          </div>

          <div className="text-sm text-gray-800">
            <strong>Changes:</strong> {ver.changes}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VersionsTab;
