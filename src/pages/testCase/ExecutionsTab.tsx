import React, { useState } from 'react';
import { ITestCase } from '../../types/testCase';
import { useAddTestExecutionMutation } from '../../api/testCaseApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

type ExecutedByType = string | { _id: string; name: string; email: string };

const ExecutionsTab: React.FC<{ testCase: ITestCase }> = ({ testCase }) => {
  const [addExecution] = useAddTestExecutionMutation();
  const { data: usersData } = useFetchAllUsersQuery({ page: 1, limit: 100 });
  const currentUser = useAppSelector(selectCurrentUser);

  // Local copy of the testCase executions
  const [executions, setExecutions] = useState(testCase.executions || []);

  // Local states for new execution
  const [executedBy, setExecutedBy] = useState(currentUser?._id || ''); // Default to current user
  const [actualResults, setActualResults] = useState('');
  const [status, setStatus] = useState<'Pass' | 'Fail' | 'Blocked' | 'Retest'>('Pass');
  const [comments, setComments] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [allowChangeExecutedBy, setAllowChangeExecutedBy] = useState(false); // Checkbox state

  const handleAddExecution = async () => {
    if (!executedBy || !actualResults) {
      alert('Executed By and Actual Results are required');
      return;
    }
    try {
      const updatedTc = await addExecution({
        id: testCase._id,
        execution: { executedBy, actualResults, status, comments, recommendations },
      }).unwrap();

      // Updated testCase from server
      setExecutions(updatedTc.executions);

      // Reset form
      setExecutedBy(currentUser?._id || ''); // Reset to current user
      setActualResults('');
      setStatus('Pass');
      setComments('');
      setRecommendations('');
      setAllowChangeExecutedBy(false); // Reset checkbox
    } catch (err) {
      console.error('Add test execution failed', err);
      alert('Failed to add test execution');
    }
  };

  // A helper to safely render executedBy
  const renderExecutedBy = (eb: ExecutedByType) => {
    if (typeof eb === 'string') {
      // Find the user object from the users list
      const user = usersData?.users.find((u) => u._id === eb);
      return user ? `${user.name} (${user.email})` : eb; // Show name and email if found
    } else {
      // It's an object with name, email
      return `${eb.name} (${eb.email})`;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-2 text-lg">Executions</h4>

      {/* List existing executions */}
      {executions.length === 0 ? (
        <p className="text-sm text-gray-500">No executions yet.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {executions.map((exe, i) => (
            <div key={i} className="border rounded p-2 bg-gray-50">
              <div className="text-sm text-gray-700">
                <strong>Executed By:</strong> {renderExecutedBy(exe.executedBy)}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Date:</strong> {new Date(exe.executionDate).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Status:</strong> {exe.status}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Actual Results:</strong> {exe.actualResults}
              </div>
              {exe.comments && (
                <div className="text-sm text-gray-600">
                  <strong>Comments:</strong> {exe.comments}
                </div>
              )}
              {exe.recommendations && (
                <div className="text-sm text-gray-600">
                  <strong>Recs:</strong> {exe.recommendations}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new execution */}
      <div className="border p-3 bg-gray-50 rounded">
        <h5 className="font-semibold mb-2 text-blue-600">Add Execution</h5>

        {/* Executed By Field */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Executed By</label>
          {!allowChangeExecutedBy ? (
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100"
              value={currentUser?.name || ''}
              disabled
            />
          ) : (
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full"
              value={executedBy}
              onChange={(e) => setExecutedBy(e.target.value)}
            >
              <option value="">-- Select a User --</option>
              {usersData?.users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Checkbox to allow changing Executed By */}
        <div className="mb-8 mt-2 flex items-center">
          <input
            type="checkbox"
            id="allowChangeExecutedBy"
            checked={allowChangeExecutedBy}
            onChange={(e) => setAllowChangeExecutedBy(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="allowChangeExecutedBy" className="text-sm">
            Change Executed By
          </label>
        </div>

        {/* Other fields */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Actual Results</label>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={actualResults}
            onChange={(e) => setActualResults(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Status</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
            <option value="Blocked">Blocked</option>
            <option value="Retest">Retest</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Comments</label>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Recommendations</label>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
          />
        </div>

        {/* Save Execution Button */}
        <button
          onClick={handleAddExecution}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Save Execution
        </button>
      </div>
    </div>
  );
};

export default ExecutionsTab;