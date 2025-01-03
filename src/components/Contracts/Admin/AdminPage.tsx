import React, { useState, useEffect } from 'react';
import ContractorList from './ContractorList';
import { useFetchContractsQuery } from '../../../api/contractApi';
import ContractList from './ContractList';
import Dashboard from './Dashboard';
import AdminPaymentsDashboard from './AdminPaymentsDashboard';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data: contractsData, error, isLoading } = useFetchContractsQuery({ skip, limit });
  const contracts = Array.isArray(contractsData?.contracts)
    ? contractsData.contracts
    : [];
  const total = contractsData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Update selectedContractId whenever contracts change
  useEffect(() => {
    if (contracts.length > 0) {
      setSelectedContractId(contracts[0]._id);
    }
  }, [contracts]);

  if (isLoading) {
    return <div>Loading contracts...</div>;
  }

  if (error) {
    return <div>Error loading contracts. Please try again later.</div>;
  }

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
            Contractors
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-yellow-100 to-yellow-50
                         text-yellow-600 rounded-t-md hover:from-yellow-200 hover:to-yellow-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Contracts
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-purple-100 to-purple-50
                         text-purple-600 rounded-t-md hover:from-purple-200 hover:to-purple-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Payments
          </Tab>
        </TabList>

        {/* TAB PANELS */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <Dashboard />
        </TabPanel>

        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Contractors</h2>
          <ContractorList />
        </TabPanel>

        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Contracts</h2>
          <ContractList />
          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </TabPanel>

        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          < AdminPaymentsDashboard />
          
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminPage;
