import React, { useState } from 'react';
import AdminSendNewsletter from './AdminSendNewsletter';
import AdminSubscriptionList from './AdminSubscriptionList';
import ConfirmSubscription from './ConfirmSubscription';
import Unsubscribe from './Unsubscribe';

const ManageNewsletter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');

  const renderContent = () => {
    switch (activeTab) {
      case 'subscriptions':
        return <AdminSubscriptionList />;
      case 'sendNewsletter':
        return <AdminSendNewsletter />;
      case 'confirmSubscription':
        return <ConfirmSubscription />;
      case 'unsubscribe':
        return <Unsubscribe />;
      default:
        return <AdminSubscriptionList />;
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 p-2">Manage Newsletter</h1>

      <div className="tabs flex justify-center space-x-4 mb-8 text-sm border max-w-5xl mx-auto bg-white p-2">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'subscriptions'
              ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white rounded'
              : 'text-gray-600 hover:bg-gray-200 rounded'
          }`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscriptions
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'sendNewsletter'
              ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white rounded'
              : 'text-gray-600 hover:bg-teal-200 rounded'
          }`}
          onClick={() => setActiveTab('sendNewsletter')}
        >
          Send Newsletter
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'confirmSubscription'
              ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white rounded'
              : 'text-gray-600 hover:bg-teal-200 rounded'
          }`}
          onClick={() => setActiveTab('confirmSubscription')}
        >
          Confirm Subscription
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'unsubscribe'
              ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white rounded'
              : 'text-gray-600 hover:bg-teal-200 rounded'
          }`}
          onClick={() => setActiveTab('unsubscribe')}
        >
          Unsubscribe
        </button>
      </div>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ManageNewsletter;
