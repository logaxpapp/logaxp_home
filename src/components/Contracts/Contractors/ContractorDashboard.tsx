import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useFetchContractsQuery } from '../../../api/contractApi';
import ContractorContractList from './ContractorContractList';

const ContractorDashboard: React.FC = () => {
 

  // Get logged-in user from Redux state
  const user = useSelector((state: RootState) => state.auth.user);


  // Fetch contracts using RTK Query
  const { data: contractsData, isLoading, error } = useFetchContractsQuery({ skip: 0, limit: 1000 });


  if (!user) {
    return <div className="text-center text-gray-600">Please log in to view your dashboard.</div>;
  }

  if (isLoading) {
    console.log('Fetching contracts...');
    return <div className="text-center text-gray-600">Loading Dashboard...</div>;
  }

  if (error) {
    console.error('Error fetching contracts:', error);
    return <div className="text-center text-red-500">Error loading dashboard data.</div>;
  }

  // Filter contracts for the logged-in contractor
  const contracts = Array.isArray(contractsData) ? contractsData : [];
  const myContracts = contracts.filter(
    (contract) => contract.contractor && String(contract.contractor._id) === String(user._id)
  );


  // Count contracts by status
  const activeContracts = myContracts.filter((contract) => contract.status === 'Active').length;
  const pendingContracts = myContracts.filter((contract) => contract.status === 'Pending').length;


  return (
    <div className="p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-blue-700">My Contracts</h2>
          <p className="text-3xl font-bold text-blue-900">{myContracts.length}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-green-700">Active Contracts</h2>
          <p className="text-3xl font-bold text-green-900">{activeContracts}</p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-yellow-700">Pending Contracts</h2>
          <p className="text-3xl font-bold text-yellow-900">{pendingContracts}</p>
        </div>
      </div>

      {/* Contracts List */}
      <h2 className="text-2xl font-bold mb-4">My Contracts</h2>
      {myContracts.length > 0 ? (
        <ContractorContractList contracts={myContracts} />
      ) : (
        <div className="text-center text-gray-500">No contracts found.</div>
      )}
    </div>
  );
};

export default ContractorDashboard;
