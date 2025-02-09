// src/features/testManager/AssignForm.tsx
import React, { useState } from 'react';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useAssignTestCaseMutation } from '../../api/testCaseApi';
import{ useToast }   from '../../features/Toast/ToastContext';

interface AssignFormProps {
  testCaseId: string;
  onAssigned?: () => void;
  onCancel?: () => void; // so we can handle 'Cancel'
}

const AssignForm: React.FC<AssignFormProps> = ({ testCaseId, onAssigned, onCancel }) => {
  const { data: usersData, isLoading, isError } = useFetchAllUsersQuery({ page: 1, limit: 50 });
  const [assignTestCase] = useAssignTestCaseMutation();
  const [selectedUser, setSelectedUser] = useState('');

  // Grab the showToast function
  const { showToast } = useToast();

  if (isLoading) return <div className="p-2">Loading users...</div>;
  if (isError) return <div className="p-2 text-red-500">Error loading users.</div>;

  const handleAssign = async () => {
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
    try {
      await assignTestCase({ id: testCaseId, payload: { userId: selectedUser } }).unwrap();

      // Show success toast
      showToast('Test case assigned successfully!', 'success', 3000);

      if (onAssigned) onAssigned();
    } catch (err: any) {
      console.error('Failed to assign test case', err);
      // Show error toast
      showToast('Failed to assign test case', 'error', 3000);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md my-2">
      <h4 className="font-medium mb-2">Assign Test Case</h4>
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-300 rounded px-3 py-1"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select a User --</option>
          {usersData?.users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Assign
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignForm;
