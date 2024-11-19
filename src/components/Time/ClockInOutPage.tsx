import React from 'react';
import ClockInOutForm from './ClockInForm';
import ClockInOutStatus from './ClockInOutStatus';

const ClockInOutPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = React.useState<string | null>(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 shadow-xl p-4 items-center justify-center text-center mt-10">Time Management</h1>
      
      {/* Clock-In/Out Form */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <ClockInOutForm />
      </div>

      {/* Status Display */}
      {selectedEmployee && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
          <ClockInOutStatus employeeId={selectedEmployee} />
        </div>
      )}
    </div>
  );
};

export default ClockInOutPage;
