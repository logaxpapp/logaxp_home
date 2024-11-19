// src/components/SuspendUserButton.tsx

import React from 'react';
import { useSuspendUserMutation } from '../api/usersApi';

interface SuspendUserButtonProps {
  userId: string;
}

const SuspendUserButton: React.FC<SuspendUserButtonProps> = ({ userId }) => {
  const [suspendUser, { isLoading, error }] = useSuspendUserMutation();

  const handleSuspend = async () => {
    try {
      await suspendUser(userId).unwrap();
      // Optionally, show success message or perform additional actions
    } catch (err) {
      // Handle error
      console.error('Failed to suspend user:', err);
    }
  };

  return (
    <button onClick={handleSuspend} disabled={isLoading}>
      {isLoading ? 'Suspending...' : 'Suspend User'}
    </button>
  );
};

export default SuspendUserButton;
