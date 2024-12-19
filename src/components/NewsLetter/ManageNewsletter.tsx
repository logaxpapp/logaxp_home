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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Manage Newsletter</h1>

      <div className="tabs flex justify-center space-x-4 mb-8">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'subscriptions'
              ? 'bg-blue-500 text-white rounded'
              : 'text-gray-600 hover:bg-gray-200 rounded'
          }`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscriptions
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'sendNewsletter'
              ? 'bg-blue-500 text-white rounded'
              : 'text-gray-600 hover:bg-gray-200 rounded'
          }`}
          onClick={() => setActiveTab('sendNewsletter')}
        >
          Send Newsletter
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'confirmSubscription'
              ? 'bg-blue-500 text-white rounded'
              : 'text-gray-600 hover:bg-gray-200 rounded'
          }`}
          onClick={() => setActiveTab('confirmSubscription')}
        >
          Confirm Subscription
        </button>

        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'unsubscribe'
              ? 'bg-blue-500 text-white rounded'
              : 'text-gray-600 hover:bg-gray-200 rounded'
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
