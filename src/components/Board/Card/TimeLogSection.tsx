import React, { useState } from 'react';
import { ICard } from '../../../types/task';
import { useLogTimeMutation } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { FiClock } from 'react-icons/fi';

interface TimeLogSectionProps {
  card: ICard;
}

const TimeLogSection: React.FC<TimeLogSectionProps> = ({ card }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [logTime, { isLoading }] = useLogTimeMutation();
  const { showToast } = useToast();

  const handleLogTime = async () => {
    if (!start || !end) {
      showToast('Please select both start and end times.');
      return;
    }

    try {
      await logTime({
        cardId: card._id,
        userId: '640c4442658fbd2131a08b51', // Example user ID
        start,
        end,
      }).unwrap();
      setStart('');
      setEnd('');
      showToast('Time logged successfully!');
    } catch (error) {
      console.error('Log time error:', error);
      showToast('Failed to log time.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Time Logs</h3>
      </div>

      {/* Input Fields */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Add Time Log</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              onClick={handleLogTime}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-white rounded-md shadow-md 
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Logging...' : 'Log Time'}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Time Logs */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Logged Times</h4>
        <div className="space-y-4">
          {card.timeLogs?.length ? (
            card.timeLogs.map((tl, idx) => (
              <div key={idx} className="p-4 border rounded-md shadow-sm bg-gray-50">
                <p className="text-sm text-gray-800">
                  <strong>Start:</strong> {tl.start ? new Date(tl.start).toLocaleString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-800">
                  <strong>End:</strong> {tl.end ? new Date(tl.end).toLocaleString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-800">
                  <strong>Duration:</strong> {tl.duration ? `${tl.duration.toFixed(2)} mins` : '--'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No time logs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeLogSection;
