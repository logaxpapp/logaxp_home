// src/pages/ContractorPage.tsx

import React from 'react';
import ContractorDashboard from './ContractorDashboard';
import ContractorContractList from './ContractorContractList';
import ContractorPaymentList from '../Payments/ContractorPaymentList';
import ContractorPaymentSummary from '../Payments/ContractorPaymentSummary';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useFetchContractsQuery } from '../../../api/contractApi';


/**
 * Enhanced ContractorPage with colorful, animated tabs and a responsive layout.
 */
const ContractorPage: React.FC = () => {
  const { data, isLoading, error } = useFetchContractsQuery({ skip: 0, limit: 100 });

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-3 text-blue-600 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching contracts:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error loading contracts. Please try again later.</p>
      </div>
    );
  }

  // Handle direct array or structured response
  const contracts = Array.isArray(data) ? data : data?.contracts || [];

  if (contracts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-xl">No contracts available.</p>
      </div>
    );
  }

  console.log("Fetched Contracts:", contracts);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Tabs className="react-tabs w-full  mx-auto">
        {/* TAB LIST */}
        <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 text-base font-medium">
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-blue-100 to-blue-50 
                         text-blue-600 rounded-t-md hover:from-blue-200 hover:to-blue-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Overview
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-green-100 to-green-50 
                         text-green-700 rounded-t-md hover:from-green-200 hover:to-green-100 transition-all 
                         duration-300 ease-in-out outline-none">
            My Contracts
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-purple-100 to-purple-50
                         text-purple-600 rounded-t-md hover:from-purple-200 hover:to-purple-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Payments
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-yellow-100 to-yellow-50
                         text-yellow-700 rounded-t-md hover:from-yellow-200 hover:to-yellow-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Summary
            {/* Add any additional content/elements below as needed */}
          </Tab>
        </TabList>

        {/* TAB PANELS */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <ContractorDashboard />
        </TabPanel>
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">My Contracts</h2>
          <ContractorContractList contracts={contracts} />
          {/* Add any additional content/elements below as needed */}
        </TabPanel>
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">My Payments</h2>
        {contracts.map((contract) => (
          <div key={contract._id} className="mb-6">
        
            <ContractorPaymentList contractId={contract._id} />
          </div>
        ))}
      </TabPanel>
      <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">My Payments</h2>
        {contracts.map((contract) => (
          <div key={contract._id} className="mb-6">
            <ContractorPaymentSummary contractId={contract._id} />
          </div>
        ))}
      </TabPanel>


      </Tabs>
    </div>
  );
};

export default ContractorPage;
