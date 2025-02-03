import React, { useState } from 'react';
import { useFetchAllTestCasesQuery } from '../../api/testCaseApi';
import { IRequirement } from '../../types/requirement';
import { FaPlug, FaAdjust } from 'react-icons/fa';

interface LinkToTestCaseModalProps {
  requirement: IRequirement;
  onClose: () => void;
  onLink: (testCaseId: string, requirementId: string) => void;
  onUnlink: (testCaseId: string, requirementId: string) => void;
}

export const LinkToTestCaseModal: React.FC<LinkToTestCaseModalProps> = ({
  requirement,
  onClose,
  onLink,
  onUnlink,
}) => {
  const [testCaseId, setTestCaseId] = useState('');
  const [mode, setMode] = useState<'link' | 'unlink'>('link');
  const [error, setError] = useState<string | null>(null);

  // Fetch test cases for the same application as the requirement
  const { data, isLoading, isError } = useFetchAllTestCasesQuery({
    application: requirement.application,
  });
  const testCaseList = data?.testCases || [];

  const handleLinkOrUnlink = () => {
    if (!testCaseId) {
      setError('Please select a Test Case.');
      return;
    }
    setError(null);
    if (mode === 'link') {
      onLink(testCaseId, requirement._id);
    } else {
      onUnlink(testCaseId, requirement._id);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700">Loading test cases...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500">Error loading test cases.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {mode === 'link' ? 'Link' : 'Unlink'} Requirement to Test Case
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaAdjust className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Requirement: <strong>{requirement.title}</strong> ({requirement.application})
        </p>

        {/* Mode Switch */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setMode('link')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'link'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Link
          </button>
          <button
            onClick={() => setMode('unlink')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'unlink'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Unlink
          </button>
        </div>

        {/* Test Case Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Test Case
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            value={testCaseId}
            onChange={(e) => setTestCaseId(e.target.value)}
          >
            <option value="">-- Select Test Case --</option>
            {testCaseList.map((tc) => (
              <option key={tc._id} value={tc._id}>
                {tc.title}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaPlug className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleLinkOrUnlink}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              mode === 'link' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {mode === 'link' ? 'Link' : 'Unlink'}
          </button>
        </div>
      </div>
    </div>
  );
};