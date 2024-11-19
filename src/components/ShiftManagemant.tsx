// src/pages/ShiftManagement.tsx

import React, { useState } from 'react';
import {
  FaList,
  FaLayerGroup,
  FaCalendarAlt,
  FaCheckCircle,
  FaGoogle,
  FaUser, // Updated icon for My Shifts
} from 'react-icons/fa';
import ShiftList from './Shift/ShiftList';
import ShiftTypeList from './ShiftType/ShiftTypeList';
import OpenShifts from './Shift/OpenShifts';
import PendingApprovalShifts from './Shift/PendingApprovalShifts';
import MyShifts from './Shift/MyShifts';
import ShiftCalendar from './Shift/ShiftCalendar';
import IntegrateGoogle from './Shift/IntegrateGoogle';
import PayPeriodList from '../components/PayPeriod/PayPeriodList';

enum ShiftManagementView {
  Shifts = 'Shifts',
  ShiftTypes = 'Shift Types',
  OpenShifts = 'Open Shifts',
  PendingApprovals = 'Pending Approvals',
  MyShifts = 'My Shifts',
  ShiftCalendar = 'Shift Calendar',
  IntegrateGoogle = 'Integrate Google',
  PayPeriods = 'Pay Periods', // New view
}

// Mapping of views to their respective icons
const viewIcons: Record<ShiftManagementView, JSX.Element> = {
  [ShiftManagementView.Shifts]: <FaList />,
  [ShiftManagementView.ShiftTypes]: <FaLayerGroup />,
  [ShiftManagementView.OpenShifts]: <FaCalendarAlt />,
  [ShiftManagementView.PendingApprovals]: <FaCheckCircle />,
  [ShiftManagementView.MyShifts]: <FaUser />,
  [ShiftManagementView.ShiftCalendar]: <FaCalendarAlt />,
  [ShiftManagementView.IntegrateGoogle]: <FaGoogle />,
  [ShiftManagementView.PayPeriods]: <FaCalendarAlt />, // Choose an appropriate icon
};

const ShiftManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ShiftManagementView>(ShiftManagementView.Shifts);

  return (
    <div className="mx-auto p-4 md:p-6 min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center sm:text-left font-primary">
            Shift Management
          </h2>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center space-x-2 mt-4 sm:mt-0 text-xs font-primary">
            {Object.values(ShiftManagementView).map((view) => (
              <button
                key={view}
                aria-pressed={currentView === view}
                aria-label={`Navigate to ${view}`}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none transition-colors duration-200 ${
                  currentView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCurrentView(view as ShiftManagementView)}
              >
                {viewIcons[view as ShiftManagementView]}
                <span className="font-medium">{view}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 text-sm">
            {currentView === ShiftManagementView.Shifts && <ShiftList />}
            {currentView === ShiftManagementView.ShiftTypes && <ShiftTypeList />}
            {currentView === ShiftManagementView.OpenShifts && <OpenShifts />}
            {currentView === ShiftManagementView.PendingApprovals && <PendingApprovalShifts />}
            {currentView === ShiftManagementView.MyShifts && <MyShifts />}
            {currentView === ShiftManagementView.ShiftCalendar && <ShiftCalendar />}
            {currentView === ShiftManagementView.IntegrateGoogle && <IntegrateGoogle />}
            {currentView === ShiftManagementView.PayPeriods && (
              <>
                
                <PayPeriodList />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;
