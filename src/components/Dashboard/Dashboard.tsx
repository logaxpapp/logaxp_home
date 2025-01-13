import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUnreadCount } from '../../store/slices/messageSlice';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Chat from '../Chat/Chat';
import { BsChatDotsFill } from 'react-icons/bs';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // State for Chat Modal

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const unreadCount = useAppSelector(selectUnreadCount);

  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
         dark:from-gray-900 dark:to-gray-800">
          {/* Content Outlet */}
          <Outlet />
        </main>

        {/* Floating Chat Button */}
        <button
          className="fixed bottom-6 right-6 bg-gradient-to-t from-teal-600 via-cyan-900 to-cyan-900  hover:bg-blue-200 text-white p-4 rounded-full shadow-lg"
          onClick={toggleChat}
          aria-label="Open Chat"
        >
          <BsChatDotsFill size={20} />
        </button>

        {/* Chat Panel */}
        {isChatOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50 transition-opacity duration-300">
              <div className="w-full max-w-8xl bg-white dark:bg-gray-800 shadow-lg transform translate-x-0 sm:translate-x-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Chat</h2>
                  <button
                  className="fixed bottom-6 right-6 bg-lemonGreen-light hover:bg-green-700 text-white p-4 rounded-full shadow-lg "
                  onClick={toggleChat}
                  aria-label="Open Chat"
                >
                  <BsChatDotsFill size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                    onClick={toggleChat}
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>

                </div>
                <div className="flex-1 overflow-y-auto ">
                  <Chat />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
