import React from 'react';
import { useFetchCurrentStatusQuery } from '../../api/timeEntryApiSlice';

interface ClockInOutStatusProps {
  employeeId: string;
}

const ClockInOutStatus: React.FC<ClockInOutStatusProps> = ({ employeeId }) => {
  const { data: status, isLoading } = useFetchCurrentStatusQuery(employeeId);

  if (isLoading) {
    return <p>Loading current status...</p>;
  }

  if (!status) {
    return <p>No status available for the selected employee.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm mt-4">
      <h2 className="text-lg font-bold mb-2">Current Status</h2>
      <p>
        <span className="font-medium">Status:</span> {status.currentStatus}
      </p>
      {status.shift && (
        <div className="mt-2">
          <h3 className="font-bold">Shift Details:</h3>
          <p>
            <span className="font-medium">Date:</span> {new Date(status.shift.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Start Time:</span> {status.shift.startTime}
          </p>
          <p>
            <span className="font-medium">End Time:</span> {status.shift.endTime}
          </p>
        </div>
      )}
      {status.break && (
        <div className="mt-2">
          <h3 className="font-bold">Break Details:</h3>
          <p>
            <span className="font-medium">Break Started:</span>{' '}
            {new Date(status.break.startTime).toLocaleTimeString()}
          </p>
          {status.break.endTime && (
            <p>
              <span className="font-medium">Break Ended:</span>{' '}
              {new Date(status.break.endTime).toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClockInOutStatus;
// Add PropTypes for type checking
import PropTypes from 'prop-types';

ClockInOutStatus.propTypes = {
    employeeId: PropTypes.string.isRequired,
};