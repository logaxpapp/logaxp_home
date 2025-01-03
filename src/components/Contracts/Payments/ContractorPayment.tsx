import React from 'react';
import ContractorPaymentList from '../Payments/ContractorPaymentList';
import ContractorPaymentSummary from '../Payments/ContractorPaymentSummary';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useFetchContractsQuery } from '../../../api/contractApi';

/**
 * Enhanced ContractorPage with colorful, animated tabs and a responsive layout.
 */
const ContractorPayment: React.FC = () => {
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

  const contracts = Array.isArray(data) ? data : data?.contracts || [];
console.log("Fetched Contracts:", contracts);
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
      <Tabs className="react-tabs w-full mx-auto">
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
            Payment List
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-purple-100 to-purple-50
                         text-purple-600 rounded-t-md hover:from-purple-200 hover:to-purple-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Payments Summary
          </Tab>
        </TabList>

        {/* Overview Tab Panel */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <div
                key={contract._id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-md shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {contract.projectName}
                </h3>
                <p className="text-gray-600">
                  Total Cost: <span className="font-bold">${contract.totalCost.toLocaleString()}</span>
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      contract.status === "Active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {contract.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Payment List Tab Panel */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
        
          {contracts.map((contract) => (
            <div key={contract._id} className="mb-6">
              <ContractorPaymentList contractId={contract._id} />
            </div>
          ))}
        </TabPanel>

        {/* Payment Summary Tab Panel */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          
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

export default ContractorPayment;
