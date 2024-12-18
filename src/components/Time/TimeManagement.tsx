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
    <div className=" mx-auto p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-blue-900 dark:text-white pb-4 border-b border-gray-300 dark:border-gray-700 font-primary">
          Time Management
        </h1>
      </header>

      {/* Navigation Buttons */}
      <nav className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-8 font-secondary">
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
            className={`flex items-center justify-center p-2 rounded-lg text-base font-semibold shadow-md transition-all duration-300 ${
              activeComponent === id ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            } border border-gray-300 dark:border-gray-700 hover:bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  hover:text-white`}
          >
            <Icon className="mr-2 text-xl" />
            {label}
          </button>
        ))}
      </nav>

      {/* Filter Dropdown (Conditionally Rendered) */}
      {activeComponent === 'AbsenceMarker' && (
        <div className="mb-8">
          <FilterByEmployeeDropdown
            value={selectedEmployee}
            onChange={(id) => setSelectedEmployee(id)}
          />
        </div>
      )}

      {/* Dynamic Content Rendering */}
      <main className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 transition-all duration-500">
        {renderComponent()}
      </main>
    </div>
  );
};

export default TimeManagement;
