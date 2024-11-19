import React, { useState } from 'react';
import { FaClock, FaUser, FaCalendarAlt, FaList } from 'react-icons/fa';
import TimeEntryList from './TimeEntryList';
import ShiftTimeEntryList from './ShiftTimeEntryList';
import PayPeriodTimeEntryList from './PayPeriodTimeEntryList';
import EmployeeTimeEntryList from './EmployeeTimeEntryList';
import AbsenceMarker from './AbsenceMarker';
import FilterByEmployeeDropdown from './FilterByEmployeeDropdown';

const TimeManagement: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    'TimeEntryList' | 'ShiftTimeEntryList' | 'PayPeriodTimeEntryList' | 'EmployeeTimeEntryList' | 'AbsenceMarker'
  >('TimeEntryList');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'TimeEntryList':
        return <TimeEntryList />;
      case 'ShiftTimeEntryList':
        return <ShiftTimeEntryList />;
      case 'PayPeriodTimeEntryList':
        return <PayPeriodTimeEntryList />;
      case 'EmployeeTimeEntryList':
        return <EmployeeTimeEntryList />;
      case 'AbsenceMarker':
        return selectedEmployee ? (
          <AbsenceMarker employeeId={selectedEmployee} />
        ) : (
          <p className="text-red-500">Please select an employee to mark absence.</p>
        );
      default:
        return <TimeEntryList />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-800 pb-4 border-b border-gray-300 font-primary">
          Time Management
        </h1>
      </header>

      {/* Navigation Buttons */}
      <nav className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        {[
          { id: 'TimeEntryList', label: 'Time Entries', icon: FaList },
          { id: 'ShiftTimeEntryList', label: 'Shifts', icon: FaClock },
          { id: 'PayPeriodTimeEntryList', label: 'Pay Periods', icon: FaCalendarAlt },
          { id: 'EmployeeTimeEntryList', label: 'Employee Time Entries', icon: FaUser },
          { id: 'AbsenceMarker', label: 'Mark Absence', icon: FaUser },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveComponent(id as typeof activeComponent)}
            className={`flex items-center justify-center p-3 rounded-md text-sm font-medium ${
              activeComponent === id ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'
            } border border-gray-200 hover:bg-blue-50`}
          >
            <Icon className="mr-2" />
            {label}
          </button>
        ))}
      </nav>

      {/* Filter Dropdown (Conditionally Rendered) */}
      {activeComponent === 'AbsenceMarker' && (
        <div className="mb-6">
          <FilterByEmployeeDropdown
            value={selectedEmployee}
            onChange={(id) => setSelectedEmployee(id)}
          />
        </div>
      )}

      {/* Dynamic Content Rendering */}
      <main className='p-10'>{renderComponent()}</main>
    </div>
  );
};

export default TimeManagement;
