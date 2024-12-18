// src/pages/ShiftsPage.tsx
import React, { useState } from 'react';
import OpenShifts from './OpenShifts';
import PendingApprovalShifts from './PendingApprovalShifts';
import MyShifts from './MyShifts';
import ShiftCalendar from './ShiftCalendar';
import IntegrateGoogle from './IntegrateGoogle';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { UserRole } from '../../types/user';
import {
  FaUserClock,
  FaCalendarPlus,
  FaClipboardCheck,
  FaBars,
  FaCalendarAlt,
  FaGoogle,
} from 'react-icons/fa'; // Imported FaGoogle icon

const ShiftsPage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [currentView, setCurrentView] = useState<
    | 'myShifts'
    | 'openShifts'
    | 'pendingApprovalShifts'
    | 'calendar'
    | 'integrateGoogle' // Added 'integrateGoogle' to the view types
  >('myShifts');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Please log in to view shifts.</p>
      </div>
    );
  }

  const { role } = user;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
        <h1 className="text-xl font-bold text-gray-800">Shift Management</h1>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-gray-800 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white p-6 shadow-lg transform md:relative md:translate-x-0 transition-transform font-secondary text-[14px] duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-1/7 z-20`}
        aria-label="Sidebar Navigation"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shift Categories</h2>
        <nav className="space-y-4">
          {/* My Shifts Button */}
          <button
            onClick={() => {
              setCurrentView('myShifts');
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'myShifts'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaUserClock className="mr-2" />
            My Shifts
          </button>

          {/* Open Shifts Button */}
          <button
            onClick={() => {
              setCurrentView('openShifts');
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'openShifts'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaCalendarPlus className="mr-2" />
            Open Shifts
          </button>

          {/* Pending Approval Shifts Button (Admin Only) */}
          {role === UserRole.Admin && (
            <button
              onClick={() => {
                setCurrentView('pendingApprovalShifts');
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'pendingApprovalShifts'
                  ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaClipboardCheck className="mr-2" />
              Pending Approvals
            </button>
          )}

          {/* Shift Calendar Button */}
          <button
            onClick={() => {
              setCurrentView('calendar');
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'calendar'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaCalendarAlt className="mr-2" />
            Shift Calendar
          </button>

          {/* Integrate Google Button */}
          <button
            onClick={() => {
              setCurrentView('integrateGoogle');
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'integrateGoogle'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaGoogle className="mr-2 text-red-500" /> {/* Google icon with red color */}
            Integrate Google
          </button>
        </nav>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-10"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0">
        {/* Header for Mobile */}
        <header className="mb-4 md:hidden">
          <h1 className="text-2xl font-bold text-gray-800">Shift Management</h1>
          <p className="text-gray-600 font-secondary">Manage your shifts and assignments effortlessly.</p>
        </header>

        {/* Content Area */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* Conditional Rendering of Views */}
          {currentView === 'myShifts' && <MyShifts />}
          {currentView === 'openShifts' && <OpenShifts />}
          {currentView === 'pendingApprovalShifts' && role === UserRole.Admin && <PendingApprovalShifts />}
          {currentView === 'calendar' && <ShiftCalendar />}
          {currentView === 'integrateGoogle' && <IntegrateGoogle />} {/* Render IntegrateGoogle */}
        </div>
      </main>
    </div>
  );
};

export default ShiftsPage;
