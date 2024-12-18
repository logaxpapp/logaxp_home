import React, { useState } from 'react';
import FAQsList from './FAQsList';
import TicketList from './TicketList';
import NewTicketForm from './NewTicketForm';
import AdminSupportDashboard from './AdminSupportDashboard';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'tickets' | 'newTicket'|'AdminSupportDashboard'  >('tickets');

  return (
    <div className="p-8 mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      
       
        <DropdownMenu
          options={[
            { label: 'FAQs', onClick: () => setActiveTab('faqs') },
            { label: 'My Tickets', onClick: () => setActiveTab('tickets') },
            { label: 'Submit Ticket', onClick: () => setActiveTab('newTicket') },
            { label: 'Admin', onClick: () => setActiveTab('AdminSupportDashboard') },
          ]}
        />
   

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
