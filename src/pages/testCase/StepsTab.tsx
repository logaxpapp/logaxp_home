// src/features/testManager/modals/tabs/StepsTab.tsx
import React, { useState } from 'react';
import { ITestCase } from '../../types/testCase';
import { useUpdateTestCaseMutation } from '../../api/testCaseApi';

// Icons
import { FaTrash, FaPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface StepsTabProps {
  testCase: ITestCase;
}

const StepsTab: React.FC<StepsTabProps> = ({ testCase }) => {
  const [updateTestCase, { isLoading }] = useUpdateTestCaseMutation();

  const [steps, setSteps] = useState(testCase.steps || []);
  const [action, setAction] = useState('');
  const [expected, setExpected] = useState('');
  const [error, setError] = useState('');

  const handleAddStep = async () => {
    if (!action.trim()) {
      setError('Action is required');
      return;
    }
    setError('');

    // Create new step
    const newStep = {
      stepNumber: steps.length + 1,
      action,
      expected,
    };
    const newSteps = [...steps, newStep];

    try {
      await updateTestCase({ id: testCase._id, data: { steps: newSteps } }).unwrap();
      setSteps(newSteps);
      setAction('');
      setExpected('');
    } catch (err) {
      console.error('Failed to add step', err);
      setError('Failed to add step. Please try again.');
    }
  };

  const handleRemoveStep = async (index: number) => {
    // Remove step from array
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    // Reassign stepNumber
    newSteps.forEach((s, i) => {
      s.stepNumber = i + 1;
    });

    try {
      await updateTestCase({ id: testCase._id, data: { steps: newSteps } }).unwrap();
      setSteps(newSteps);
    } catch (err) {
      console.error('Failed to remove step', err);
      setError('Failed to remove step. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-gray-800">Test Steps</h4>

      {/* List steps */}
      {steps.length === 0 ? (
        <p className="text-gray-600">No steps defined.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-2">
          {steps.map((st, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <strong className="text-gray-800">Step {st.stepNumber}:</strong> {st.action} <br />
                <span className="text-sm text-gray-600">Expected: {st.expected}</span>
              </div>
              <button
                onClick={() => handleRemoveStep(idx)}
                className="text-red-600 hover:text-red-800 flex items-center"
                disabled={isLoading}
              >
                <FaTrash className="mr-1" /> Remove
              </button>
            </li>
          ))}
        </ol>
      )}

      {/* Add new step */}
      <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Enter the action for this step"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Result</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            placeholder="Enter the expected result for this step"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center text-red-600 text-sm mb-3">
            <FaExclamationCircle className="mr-2" /> {error}
          </div>
        )}

        <button
          onClick={handleAddStep}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <FaPlus className="mr-2" /> Add Step
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepsTab;