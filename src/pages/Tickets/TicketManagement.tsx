import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// Framer Motion
import { motion } from 'framer-motion';

// RTK Query hook (adjust the import path to your project)
import { useFetchTicketsQuery } from '../../api/ticketsApi';

// Child Components
import MyTicket from './MyTicket';
import ComingSoon from '../../pages/ComingSoon';
import TicketsAssignedToMe from './TicketsAssignedToMe';
import TicketsCreatedByMe from './TicketCreatedByMe';
import MyCompletedTickets from './MyCompletedTickets';
import MyPendingTickets from './MyPendingTickets';

interface IStats {
  total: number;
  open: number;
  pending: number;
  critical: number;
  resolved: number;
  closed: number;
  inProgress: number;
}

const TicketManagement: React.FC = () => {
  // 1) Fetch real ticket data
  //    - If you want all tickets, set skip=0, limit=9999 or remove if not needed
  const { data, isLoading, isError } = useFetchTicketsQuery({ skip: 0, limit: 9999 });

  // 2) Local state for aggregated stats
  const [stats, setStats] = useState<IStats>({
    total: 0,
    open: 0,
    pending: 0,
    critical: 0,
    resolved: 0,
    closed: 0,
    inProgress: 0,
  });

  // 3) Once data is loaded, compute the stats
  useEffect(() => {
    if (data?.tickets && !isLoading && !isError) {
      const allTickets = data.tickets;

      const open = allTickets.filter((t) => t.status === 'Open').length;
      const pending = allTickets.filter((t) => t.status === 'Pending').length;
      const critical = allTickets.filter((t) => t.status === 'Critical').length;
      const resolved = allTickets.filter((t) => t.status === 'Resolved').length;
      const closed = allTickets.filter((t) => t.status === 'Closed').length;
      const inProgress = allTickets.filter((t) => t.status === 'In Progress').length;

      setStats({
        total: allTickets.length,
        open,
        pending,
        critical,
        resolved,
        closed,
        inProgress,
      });
    }
  }, [data, isLoading, isError]);

  // 4) A simple fade-in animation for each tab panel
  const panelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Header Section */}
        <div className="px-4 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Ticket Management</h2>
        </div>

        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              Overview
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md">
              My Tickets
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md">
              Assigned to me
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-yellow-50 hover:bg-gray-200 rounded-t-md">
              Created By me
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-red-50 hover:bg-gray-200 rounded-t-md">
              Completed Tickets
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-t-md">
              Pending Tickets
            </Tab>
          </TabList>

          {/* ========== TAB PANELS ========== */}

          {/* 1) OVERVIEW */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              {isLoading && <p className="text-gray-500">Loading overview...</p>}
              {isError && (
                <p className="text-red-500">Failed to load ticket data.</p>
              )}
              {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Example Stat Card */}
                  <div className="p-4 bg-blue-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Tickets</p>
                    <p className="text-xl font-bold text-blue-800">{stats.total}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Open</p>
                    <p className="text-xl font-bold text-green-800">{stats.open}</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Critical</p>
                    <p className="text-xl font-bold text-red-800">{stats.critical}</p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-xl font-bold text-indigo-800">{stats.resolved}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Closed</p>
                    <p className="text-xl font-bold text-gray-800">{stats.closed}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg shadow">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-xl font-bold text-purple-800">{stats.inProgress}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </TabPanel>

          {/* 2) MY TICKETS */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <MyTicket />
            </motion.div>
          </TabPanel>

          {/* 3) ASSIGNED TO ME */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <TicketsAssignedToMe />
            </motion.div>
          </TabPanel>

          {/* 4) CREATED BY ME */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <TicketsCreatedByMe />
            </motion.div>
          </TabPanel>

          {/* 5) COMPLETED TICKETS */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <MyCompletedTickets />
            </motion.div>
          </TabPanel>

          {/* 6) PENDING TICKETS */}
          <TabPanel className="react-tabs__tab-panel p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <MyPendingTickets />
            </motion.div>
          </TabPanel>

        </Tabs>
      </div>
    </div>
  );
};

export default TicketManagement;
