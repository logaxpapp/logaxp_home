import React, { useState } from 'react';
import { useFetchContractorsQuery } from '../../../api/contractApi'; // To get all contractors
import { useFetchContractsByContractorQuery } from '../../../api/contractApi'; // To fetch contracts by contractor
import CreatePayment from '../Payments/CreatePayment';
import PaymentList from '../Payments/PaymentList';
import PaymentSummary from '../Payments/PaymentSummary';
import { FaBuilding, FaFileContract, FaMoneyCheckAlt } from 'react-icons/fa';
import { HiSelector } from 'react-icons/hi';

/**
 * AdminPaymentsDashboard
 * 1) Select Contractor
 * 2) Select a contract from that contractor
 * 3) Show Payment creation, Payment list, Payment summary
 */
const AdminPaymentsDashboard: React.FC = () => {
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [selectedContractId, setSelectedContractId] = useState('');

  // Fetch all contractors
  const {
    data: contractors,
    isLoading: contractorsLoading,
    error: contractorsError,
  } = useFetchContractorsQuery({ skip: 0, limit: 1000 });

  // Fetch contracts for the selected contractor
  const {
    data: contractorContracts,
    isLoading: contractsLoading,
    error: contractsError,
  } = useFetchContractsByContractorQuery(selectedContractorId, {
    skip: !selectedContractorId,
  });

  // Handle Contractor dropdown
  const handleSelectContractor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contractorId = e.target.value;
    setSelectedContractorId(contractorId);
    setSelectedContractId(''); // Reset contract selection
  };

  // Handle Contract dropdown
  const handleSelectContract = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContractId(e.target.value);
  };

  if (contractorsLoading)
    return <div className="text-gray-500 text-center mt-4">Loading contractors...</div>;
  if (contractorsError)
    return <div className="text-red-500 text-center mt-4">Failed to load contractors.</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-6 flex items-center">
        <FaMoneyCheckAlt className="mr-2" />
        Admin Payments Dashboard
      </h1>

      {/* Contractor Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center">
          <FaBuilding className="mr-2" />
          Select Contractor:
        </label>
        <div className="relative">
          <select
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
            value={selectedContractorId}
            onChange={handleSelectContractor}
          >
            <option value="">-- Select Contractor --</option>
            {contractors?.map((contractor) => (
              <option key={contractor._id} value={contractor._id}>
                {contractor.name}
              </option>
            ))}
          </select>
          <HiSelector className="absolute top-3 right-3 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Contract Dropdown */}
      {selectedContractorId && (
        <div className="mb-6">
          {contractsLoading && (
            <div className="text-gray-500 text-center">Loading contracts...</div>
          )}
          {contractsError && (
            <div className="text-red-500 text-center">Error loading contractor's contracts.</div>
          )}
          {contractorContracts && contractorContracts.length > 0 ? (
            <>
              <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center">
                <FaFileContract className="mr-2" />
                Select Contract:
              </label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                  value={selectedContractId}
                  onChange={handleSelectContract}
                >
                  <option value="">-- Select Contract --</option>
                  {contractorContracts.map((contract) => (
                    <option key={contract._id} value={contract._id}>
                      {contract.projectName}
                    </option>
                  ))}
                </select>
                <HiSelector className="absolute top-3 right-3 text-gray-500 dark:text-gray-400" />
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center">No contracts found for this contractor.</div>
          )}
        </div>
      )}

      {/* Payments UI */}
      {selectedContractId && (
        <div className="space-y-8">
          <CreatePayment contractorId={selectedContractorId} contractId={selectedContractId} />
          <PaymentList contractId={selectedContractId} />
          <PaymentSummary contractId={selectedContractId} />
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsDashboard;
