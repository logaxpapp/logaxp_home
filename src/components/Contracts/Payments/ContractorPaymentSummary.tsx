import React from 'react';
import { useFetchPaymentSummaryQuery } from '../../../api/paymentApi';
import { PaymentSummaryResponse } from '../../../types/payment'; // Ensure correct import
import { useToast } from '../../../features/Toast/ToastContext'; // Ensure correct import

interface ContractorPaymentSummaryProps {
  contractId: string;
}

const ContractorPaymentSummary: React.FC<ContractorPaymentSummaryProps> = ({ contractId }) => {
  const { data, isLoading, error } = useFetchPaymentSummaryQuery(contractId);
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Loading summary...</p>
      </div>
    );
  }

  if (error) {
    showToast('Error loading summary.');
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500">Error loading summary.</p>
      </div>
    );
  }

  const { totalCost, totalPaid, balance } = data as PaymentSummaryResponse;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Payment Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Cost */}
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 uppercase font-semibold">Total Cost</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            ${totalCost.toLocaleString()}
          </p>
        </div>

        {/* Total Paid */}
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 uppercase font-semibold">Total Paid</p>
          <p className="text-3xl font-extrabold text-green-600 mt-2">
            ${totalPaid.toLocaleString()}
          </p>
        </div>

        {/* Balance */}
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 uppercase font-semibold">Balance</p>
          <p
            className={`text-3xl font-extrabold mt-2 ${
              balance < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractorPaymentSummary;
