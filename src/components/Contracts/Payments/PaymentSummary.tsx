import React from 'react';
import { useFetchPaymentSummaryQuery } from '../../../api/paymentApi';

interface PaymentSummaryProps {
  contractId: string | null;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ contractId }) => {
  if (!contractId) {
    return <div>No contract selected to display summary.</div>;
  }

  const { data, isLoading, error } = useFetchPaymentSummaryQuery(contractId);

  if (isLoading) return <div>Loading summary...</div>;
  if (error) return <div>Error loading summary.</div>;

  const { totalCost, totalPaid, balance } = data || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
      <div className="flex justify-around">
        <div className="text-center">
          <p className="text-gray-700">Total Cost</p>
          <p className="text-2xl font-bold">${totalCost?.toLocaleString() || '0'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-700">Total Paid</p>
          <p className="text-2xl font-bold">${totalPaid?.toLocaleString() || '0'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-700">Balance</p>
          <p className={`text-2xl font-bold ${balance && balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${balance?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
