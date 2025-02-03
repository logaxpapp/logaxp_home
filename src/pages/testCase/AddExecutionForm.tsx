// src/features/testManager/AddExecutionForm.tsx
import React, { useState } from 'react';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useAddTestExecutionMutation } from '../../api/testCaseApi';
import { IUser } from '../../types/user';

interface AddExecutionFormProps {
  testCaseId: string;
  onAdded?: () => void;
  onCancel?: () => void;
}

const AddExecutionForm: React.FC<AddExecutionFormProps> = ({ testCaseId, onAdded, onCancel }) => {
  // We pass { page: 1, limit: 1000 } so we get up to 1000 users
  const { data: allUsersData, isLoading, isError } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000,
  });
  const [addTestExecution] = useAddTestExecutionMutation();

  const [executedBy, setExecutedBy] = useState('');
  const [actualResults, setActualResults] = useState('');
  const [status, setStatus] = useState<'Pass' | 'Fail' | 'Blocked' | 'Retest'>('Pass');
  const [comments, setComments] = useState('');
  const [recommendations, setRecommendations] = useState('');

  if (isLoading) return <div className="p-2">Loading users for execution...</div>;
  if (isError) return <div className="p-2 text-red-500">Error loading users.</div>;

  // Now allUsersData has shape { users: IUser[], total: number }
  // We'll map over allUsersData.users
  const handleAddExecution = async () => {
    if (!executedBy || !actualResults) {
      alert('executedBy and actualResults are required');
      return;
    }
    try {
      await addTestExecution({
        id: testCaseId,
        execution: {
          executedBy,
          actualResults,
          status,
          comments,
          recommendations,
        },
      }).unwrap();
      if (onAdded) onAdded();
    } catch (err: any) {
      console.error('Add test execution failed', err);
      alert('Failed to add test execution');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md my-2">
      <h4 className="font-medium mb-2">Add Execution</h4>

      <div className="flex flex-col mb-2">
        <label className="text-sm font-medium mb-1">Executed By</label>
        <select
          className="border border-gray-300 rounded px-3 py-1"
          value={executedBy}
          onChange={(e) => setExecutedBy(e.target.value)}
        >
          <option value="">-- Select a User --</option>
          {allUsersData?.users.map((user: IUser) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-sm font-medium mb-1">Actual Results</label>
        <input
          className="border border-gray-300 rounded px-3 py-1"
          value={actualResults}
          onChange={(e) => setActualResults(e.target.value)}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-sm font-medium mb-1">Status</label>
        <select
          className="border border-gray-300 rounded px-3 py-1"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
          <option value="Blocked">Blocked</option>
          <option value="Retest">Retest</option>
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-sm font-medium mb-1">Comments</label>
        <input
          className="border border-gray-300 rounded px-3 py-1"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-sm font-medium mb-1">Recommendations</label>
        <input
          className="border border-gray-300 rounded px-3 py-1"
          value={recommendations}
          onChange={(e) => setRecommendations(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleAddExecution}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
        >
          Save Execution
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AddExecutionForm;
