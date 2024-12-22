// src/components/Admin/Dashboard/Dashboard.tsx

import React from 'react';
import { useFetchContractsQuery, useFetchContractorsQuery } from "../../../api/contractApi";

const Dashboard: React.FC = () => {
  const { data: contractsData, isLoading: isLoadingContracts, error: contractsError } = useFetchContractsQuery({ skip: 0, limit: 1000 });
  const { data: contractorsData, isLoading: isLoadingContractors, error: contractorsError } = useFetchContractorsQuery({ skip: 0, limit: 1000 });

  if (isLoadingContracts || isLoadingContractors) {
    return <div>Loading Dashboard...</div>;
  }

  if (contractsError || contractorsError) {
    console.error('Error fetching data:', { contractsError, contractorsError });
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  // Corrected totalContractors calculation
  const totalContracts = contractsData?.total || 0;
  const activeContracts = contractsData?.contracts?.filter(c => c.status === 'Active').length || 0;
  const totalContractors = contractorsData?.length || 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl">Total Contracts</h2>
        <p className="text-3xl">{totalContracts}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl">Active Contracts</h2>
        <p className="text-3xl">{activeContracts}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl">Total Contractors</h2>
        <p className="text-3xl">{totalContractors}</p>
      </div>
    </div>
  );
};

export default Dashboard;
