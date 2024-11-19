import React from 'react';
import { useUpdateTimeEntryMutation } from '../../api/timeEntryApiSlice';

interface ClockOutButtonProps {
  timeEntryId: string;
}

const ClockOutButton: React.FC<ClockOutButtonProps> = ({ timeEntryId }) => {
  const [updateTimeEntry, { isLoading }] = useUpdateTimeEntryMutation();

  const handleClockOut = async () => {
    if (!window.confirm('Are you sure you want to clock out?')) return;

    try {
      const clockOutTime = new Date().toISOString();
      await updateTimeEntry({ id: timeEntryId, updates: { clockOut: clockOutTime } });
      alert('Clock-Out successful!');
    } catch (error) {
      console.error('Failed to clock out:', error);
      alert('Failed to clock out.');
    }
  };

  return (
    <button
      onClick={handleClockOut}
      className={`px-4 py-2 bg-red-600 text-white rounded-md ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={isLoading}
    >
      {isLoading ? 'Clocking Out...' : 'Clock Out'}
    </button>
  );
};

export default ClockOutButton;
