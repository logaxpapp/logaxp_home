import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  FaUserClock,
  FaCalendarPlus,
  FaClipboardCheck,
  FaCalendarAlt,
  FaGoogle,
} from 'react-icons/fa';
import OpenShifts from './OpenShifts';
import PendingApprovalShifts from './PendingApprovalShifts';
import MyShifts from './MyShifts';
import ShiftCalendar from './ShiftCalendar';
import IntegrateGoogle from './IntegrateGoogle';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { UserRole } from '../../types/user';

const ShiftsPage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Please log in to view shifts.</p>
      </div>
    );
  }

  const { role } = user;

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
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md flex items-center">
              My Shifts
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md flex items-center">
             Open Shifts
            </Tab>
            {role === UserRole.Admin && (
              <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md flex items-center">
               Pending Approvals
              </Tab>
            )}
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md flex items-center">
              Shift Calendar
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md flex items-center">
              Integrate Google
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <MyShifts />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <OpenShifts />
          </TabPanel>
          {role === UserRole.Admin && (
            <TabPanel className="react-tabs__tab-panel p-4">
              <PendingApprovalShifts />
            </TabPanel>
          )}
          <TabPanel className="react-tabs__tab-panel p-4">
            <ShiftCalendar />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <IntegrateGoogle />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ShiftsPage;
