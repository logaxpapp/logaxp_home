import React, { useState } from 'react';
import { useFetchContractorsQuery } from '../../../api/contractApi';  // To get all contractors
import { useFetchContractsByContractorQuery } from '../../../api/contractApi'; // The new query
import CreatePayment from '../Payments/CreatePayment';
import PaymentList from '../Payments/PaymentList';
import PaymentSummary from '../Payments/PaymentSummary';

/**
 * AdminPaymentsDashboard
 * 1) Select Contractor
 * 2) Select a contract from that contractor
 * 3) Show Payment creation, Payment list, Payment summary
 */
const AdminPaymentsDashboard: React.FC = () => {
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [selectedContractId, setSelectedContractId] = useState('');

  // 1) Fetch all contractors (Admin only).
  const {
    data: contractors,
    isLoading: contractorsLoading,
    error: contractorsError,
  } = useFetchContractorsQuery({ skip: 0, limit: 1000 });

  // 2) Once a contractor is selected, fetch only that contractor’s contracts.
  const {
    data: contractorContracts,
    isLoading: contractsLoading,
    error: contractsError,
  } = useFetchContractsByContractorQuery(selectedContractorId, {
    skip: !selectedContractorId, // skip if no contractor selected
  });

  // Handle Contractor dropdown
  const handleSelectContractor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contractorId = e.target.value;
    setSelectedContractorId(contractorId);
    setSelectedContractId(''); // reset contract selection
  };

  // Handle Contract dropdown
  const handleSelectContract = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContractId(e.target.value);
  };

  if (contractorsLoading) return <div>Loading contractors...</div>;
  if (contractorsError) return <div>Failed to load contractors.</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Payment Dashboard</h1>

      <div className="mb-4 flex flex-col">
        {/* CONTRACTOR DROPDOWN */}
        <label className="block mb-2 font-medium text-gray-700">Select Contractor:</label>
        <select
          className="border rounded p-2 mb-4"
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

        {/* CONTRACT DROPDOWN (once contractor is selected) */}
        {selectedContractorId && (
          <>
            {contractsLoading && <div>Loading contracts...</div>}
            {contractsError && <div>Error loading contractor's contracts.</div>}

            {contractorContracts && contractorContracts.length > 0 ? (
              <>
                <label className="block mb-2 font-medium text-gray-700">Select Contract:</label>
                <select
                  className="border rounded p-2 mb-4"
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
              </>
            ) : (
              <div>No contracts found for this contractor.</div>
            )}
          </>
        )}
      </div>

      {/* Once contract is selected, show payments UI */}
      {selectedContractId && (
        <div className="mt-6 space-y-6">
          {/* CREATE PAYMENT */}
          <CreatePayment contractorId={selectedContractorId} contractId={selectedContractId} />

          {/* LIST OF PAYMENTS */}
          <PaymentList contractId={selectedContractId} />

          {/* PAYMENT SUMMARY */}
          <PaymentSummary contractId={selectedContractId} />
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsDashboard;
