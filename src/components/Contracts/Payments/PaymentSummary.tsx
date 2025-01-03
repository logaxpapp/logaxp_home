import React from 'react';
import { useFetchPaymentSummaryQuery } from '../../../api/paymentApi';
import { useFetchContractByIdQuery } from '../../../api/contractApi';

interface PaymentSummaryProps {
  contractId: string | null;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ contractId }) => {
  if (!contractId) {
    return <div>No contract selected to display summary.</div>;
  }

  // Fetch payment summary
  const { data: paymentData, isLoading: isPaymentLoading, error: paymentError } =
    useFetchPaymentSummaryQuery(contractId);

  // Fetch contract details
  const { data: contractData, isLoading: isContractLoading, error: contractError } =
    useFetchContractByIdQuery(contractId);

  if (isPaymentLoading || isContractLoading) {
    return <div>Loading summary...</div>;
  }

  if (paymentError || contractError) {
    return <div>Error loading summary or contract details.</div>;
  }

  const { totalCost, totalPaid, balance } = paymentData || {};
  const { projectName, description, status } = contractData || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      {/* Contract Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{projectName || 'Project Name Not Available'}</h3>
        <p className="text-gray-600 text-sm">{description || 'No description available'}</p>
        <p className={`text-sm font-medium ${
          status === 'Active' ? 'text-green-600' : 'text-red-600'
        }`}>
          Status: {status || 'N/A'}
        </p>
      </div>

      {/* Payment Summary */}
      <p className="text-sm text-gray-500 mb-4">
        Below is the payment summary for this project, including total cost, amount paid, and remaining balance.
      </p>
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
          <p
            className={`text-2xl font-bold ${
              balance && balance < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ${balance?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
