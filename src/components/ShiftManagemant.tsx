import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
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

const ShiftManagement: React.FC = () => {
  // Mock Data for Overview Section
  const mockShiftData = {
    totalShifts: 50,
    openShifts: 20,
    pendingApprovals: 10,
    myShifts: 15,
    shiftTypes: 5,
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">

        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Shift Management</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Overview
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Shifts
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              Shift Types
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              Open Shifts
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-purple-50 hover:bg-gray-200 rounded-t-md">
              Pending Approvals
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-teal-50 hover:bg-gray-200 rounded-t-md">
              My Shifts
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-indigo-50 hover:bg-gray-200 rounded-t-md">
              Shift Calendar
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-cyan-50 hover:bg-gray-200 rounded-t-md">
              Integrate Google
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md">
              Pay Periods
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Overview Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-blue-700">Total Shifts</h2>
                <p className="text-3xl font-bold text-blue-900">{mockShiftData.totalShifts}</p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-green-700">Open Shifts</h2>
                <p className="text-3xl font-bold text-green-900">{mockShiftData.openShifts}</p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-yellow-700">Pending Approvals</h2>
                <p className="text-3xl font-bold text-yellow-900">{mockShiftData.pendingApprovals}</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-purple-700">My Shifts</h2>
                <p className="text-3xl font-bold text-purple-900">{mockShiftData.myShifts}</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-teal-700">Shift Types</h2>
                <p className="text-3xl font-bold text-teal-900">{mockShiftData.shiftTypes}</p>
              </div>
            </div>
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ShiftList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ShiftTypeList />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <OpenShifts />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <PendingApprovalShifts />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <MyShifts />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <ShiftCalendar />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <IntegrateGoogle />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <PayPeriodList />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ShiftManagement;
