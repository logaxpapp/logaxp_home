import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MyTicket from './MyTicket';
import ComingSoon from '../../pages/ComingSoon';
import TicketsAssignedToMe from './TicketsAssignedToMe';
import TicketsCreatedByMe from './TicketCreatedByMe';
import MyCompletedTickets from './MyCompletedTickets';
import MyPendingTickets from './MyPendingTickets.tsx';


const TicketManagement: React.FC = () => {
  // Mock Data for Overview Section
  const mockTicketData = {
    totalTickets: 50,
    openTickets: 15,
    resolvedTickets: 30,
    pendingTickets: 5,
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

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* My Tickets Section */}
            <MyTicket />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
            <TicketsAssignedToMe />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
          <TicketsCreatedByMe />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
           
            <MyCompletedTickets />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
           
            <MyPendingTickets />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default TicketManagement;
