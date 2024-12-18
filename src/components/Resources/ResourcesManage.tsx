import React, { useState } from 'react';
import ResourceList from './ResourceList';
import PolicyAcknowledgement from './PolicyAcknowledgement';
import UserResources from './UserResources';

const ResourcesManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'resourceList' | 'policyAcknowledgement' | 'userResources'
  >('resourceList');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'resourceList':
        return <ResourceList />;
      case 'policyAcknowledgement':
        return <PolicyAcknowledgement />;
      case 'userResources':
        return <UserResources />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-screen font-secondary">
      {/* Header */}
      <header className="bg-gray-50 text-gray-700 dark:text-white shadow-md p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Resource Management</h1>
          <p className="text-sm sm:text-base italic mt-2 sm:mt-0">
            Empowering users with efficient resource handling
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Sticky Tabs (Optional) */}
          <nav
            className="flex overflow-x-auto border-b dark:border-gray-700"
            role="tablist"
            aria-label="Resource Management Tabs"
          >
            {[
              { id: 'resourceList', label: 'Resource List' },
              { id: 'policyAcknowledgement', label: 'Policy Acknowledgement' },
              { id: 'userResources', label: 'User Resources' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`flex-shrink-0 px-6 py-3 text-center font-semibold text-lg transition-all duration-300 focus:outline-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white border-b-2 border-teal-800'
                    : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-teal-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Tab Content */}
      <main className="max-w-7xl mx-auto mt-8 px-4">
        <div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-all duration-500"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default ResourcesManage;
