import React, { useState } from 'react';
import ResourceList from './ResourceList';
import PolicyAcknowledgement from './PolicyAcknowledgement';
import UserResources from './UserResources';


const ResourcesManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resourceList' | 'policyAcknowledgement' | 'userResources'>(
    'resourceList'
  );

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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-6 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Resource Management</h1>
          <p className="text-sm opacity-90">
            Manage your resources, policies, and user-specific information in one place.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('resourceList')}
              className={`w-1/3 py-3 text-center font-semibold transition-all ${
                activeTab === 'resourceList'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Resource List
            </button>
            <button
              onClick={() => setActiveTab('policyAcknowledgement')}
              className={`w-1/3 py-3 text-center font-semibold transition-all ${
                activeTab === 'policyAcknowledgement'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Policy Acknowledgement
            </button>
            <button
              onClick={() => setActiveTab('userResources')}
              className={`w-1/3 py-3 text-center font-semibold transition-all ${
                activeTab === 'userResources'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              User Resources
            </button>
          </div>
        </div>
      </div>

      {/* Active Tab Content */}
      <div className=" mx-auto mt-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default ResourcesManage;
