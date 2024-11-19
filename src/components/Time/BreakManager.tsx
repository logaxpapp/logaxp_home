import React from 'react';
import { useStartBreakMutation, useEndBreakMutation } from '../../api/timeEntryApiSlice';

interface BreakManagerProps {
  timeEntryId: string;
}

const BreakManager: React.FC<BreakManagerProps> = ({ timeEntryId }) => {
  const [startBreak] = useStartBreakMutation();
  const [endBreak] = useEndBreakMutation();

  const handleStartBreak = async () => {
    try {
      await startBreak(timeEntryId);
      alert('Break Started');
    } catch (error) {
      alert('Failed to Start Break: ' + (error as any).message);
    }
  };

  const handleEndBreak = async () => {
    try {
      await endBreak(timeEntryId);
      alert('Break Ended');
    } catch (error) {
      alert('Failed to End Break: ' + (error as any).message);
    }
  };

  return (
    <div className="mt-4">
      <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleStartBreak}>
        Start Break
      </button>
      <button className="bg-green-500 text-white py-2 px-4 rounded ml-4" onClick={handleEndBreak}>
        End Break
      </button>
    </div>
  );
};

export default BreakManager;
