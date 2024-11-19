import React, { useState } from 'react';
import FAQsList from './FAQsList';
import TicketList from './TicketList';
import NewTicketForm from './NewTicketForm';
import AdminSupportDashboard from './AdminSupportDashboard';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'tickets' | 'newTicket'|'AdminSupportDashboard'  >('tickets');

  return (
    <div className="p-16 mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 shadow-lg p-4">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-gray-100 font-primary">Support Center</h2>
        <DropdownMenu
          options={[
            { label: 'FAQs', onClick: () => setActiveTab('faqs') },
            { label: 'My Tickets', onClick: () => setActiveTab('tickets') },
            { label: 'Submit Ticket', onClick: () => setActiveTab('newTicket') },
            { label: 'Admin', onClick: () => setActiveTab('AdminSupportDashboard') },
          ]}
        />
      </header>

      {/* Tabs */}
      <div className="mt-6">
        {activeTab === 'faqs' && <FAQsList />}
        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'newTicket' && (
            <NewTicketForm
                onSuccess={() => {
                setActiveTab('tickets'); // Redirect to tickets after success
                }}
                onCancel={() => setActiveTab('tickets')} // Redirect to tickets on cancel
            />
            )}

        {activeTab === 'AdminSupportDashboard' && <AdminSupportDashboard />}
      </div>
    </div>
  );
};

export default Support;
