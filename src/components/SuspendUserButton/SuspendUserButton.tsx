// src/components/SuspendUserButton/SuspendUserButton.tsx

import React from 'react';
import { useSuspendUserMutation } from '../../api/apiSlice';

interface SuspendUserButtonProps {
  userId: string;
}

const SuspendUserButton: React.FC<SuspendUserButtonProps> = ({ userId }) => {
  const [suspendUser, { isLoading, error }] = useSuspendUserMutation();

  const handleSuspend = async () => {
    try {
      await suspendUser(userId).unwrap();
      // Optionally, show a success message or perform additional actions
    } catch (err) {
      console.error('Failed to suspend user:', err);
    }
  };

  return (
    <button
      onClick={handleSuspend}
      disabled={isLoading}
      className="px-4 py-2 bg-yellow-500 text-white rounded"
    >
      {isLoading ? 'Suspending...' : 'Suspend User'}
    </button>
  );
};

export default SuspendUserButton;
