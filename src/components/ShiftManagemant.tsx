import React, { useState } from 'react';
import {
  FaList,
  FaLayerGroup,
  FaCalendarAlt,
  FaCheckCircle,
  FaGoogle,
  FaUser,
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
  PayPeriods = 'Pay Periods',
}

const viewIcons: Record<ShiftManagementView, JSX.Element> = {
  [ShiftManagementView.Shifts]: <FaList />,
  [ShiftManagementView.ShiftTypes]: <FaLayerGroup />,
  [ShiftManagementView.OpenShifts]: <FaCalendarAlt />,
  [ShiftManagementView.PendingApprovals]: <FaCheckCircle />,
  [ShiftManagementView.MyShifts]: <FaUser />,
  [ShiftManagementView.ShiftCalendar]: <FaCalendarAlt />,
  [ShiftManagementView.IntegrateGoogle]: <FaGoogle />,
  [ShiftManagementView.PayPeriods]: <FaCalendarAlt />,
};

const ShiftManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ShiftManagementView>(ShiftManagementView.Shifts);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Shift Management
        </h2>
      </header>

      {/* Tabs Section */}
      <div className="relative overflow-x-auto mb-4 text-sm">
        <div className="flex space-x-2 whitespace-nowrap overflow-x-scroll scrollbar-hide">
          {Object.values(ShiftManagementView).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view as ShiftManagementView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-pressed={currentView === view}
              aria-label={`Navigate to ${view}`}
            >
              {viewIcons[view as ShiftManagementView]}
              <span>{view}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        {currentView === ShiftManagementView.Shifts && <ShiftList />}
        {currentView === ShiftManagementView.ShiftTypes && <ShiftTypeList />}
        {currentView === ShiftManagementView.OpenShifts && <OpenShifts />}
        {currentView === ShiftManagementView.PendingApprovals && <PendingApprovalShifts />}
        {currentView === ShiftManagementView.MyShifts && <MyShifts />}
        {currentView === ShiftManagementView.ShiftCalendar && <ShiftCalendar />}
        {currentView === ShiftManagementView.IntegrateGoogle && <IntegrateGoogle />}
        {currentView === ShiftManagementView.PayPeriods && <PayPeriodList />}
      </div>
    </div>
  );
};

export default ShiftManagement;
