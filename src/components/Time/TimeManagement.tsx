import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TimeEntryList from './TimeEntryList';
import ShiftTimeEntryList from './ShiftTimeEntryList';
import PayPeriodTimeEntryList from './PayPeriodTimeEntryList';
import EmployeeTimeEntryList from './EmployeeTimeEntryList';
import AbsenceMarker from './AbsenceMarker';
import FilterByEmployeeDropdown from './FilterByEmployeeDropdown';

const TimeManagement: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">

        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Time Management</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md flex items-center">
             Time Entries
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md flex items-center">
             Shifts
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md flex items-center">
              Pay Periods
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md flex items-center">
             Employee Time Entries
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md flex items-center">
             Mark Absence
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <TimeEntryList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ShiftTimeEntryList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <PayPeriodTimeEntryList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <EmployeeTimeEntryList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Conditional Absence Marker with Dropdown */}
            <div className="mb-4">
              <FilterByEmployeeDropdown
                value={selectedEmployee}
                onChange={(id) => setSelectedEmployee(id)}
              />
            </div>
            {selectedEmployee ? (
              <AbsenceMarker employeeId={selectedEmployee} />
            ) : (
              <p className="text-red-500">Please select an employee to mark absence.</p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default TimeManagement;
