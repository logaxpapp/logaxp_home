// src/components/Contractor/Contracts/ContractorPaymentList.tsx

import React from 'react';
import {
  useFetchPaymentsForContractQuery,
  useAcknowledgePaymentMutation,
  useDeclinePaymentAsContractorMutation,
} from '../../../api/paymentApi';
import { useToast } from '../../../features/Toast/ToastContext';
import Button from '../../common/Button';

interface ContractorPaymentListProps {
  contractId: string;
}

const ContractorPaymentList: React.FC<ContractorPaymentListProps> = ({
  contractId,
}) => {
  const { data: payments, isLoading, error } =
    useFetchPaymentsForContractQuery(contractId);
  const [acknowledgePayment] = useAcknowledgePaymentMutation();
  const [declinePaymentAsContractor] = useDeclinePaymentAsContractorMutation();
  const { showToast } = useToast();

  const handleAcknowledge = async (paymentId: string) => {
    try {
      await acknowledgePayment(paymentId).unwrap();
      showToast('Payment acknowledged successfully!');
    } catch (err) {
      console.error('Failed to acknowledge payment:', err);
      showToast('Error acknowledging payment.', 'error');
    }
  };

  const handleDecline = async (paymentId: string) => {
    const reason = window.prompt('Please provide a reason for declining the payment:');
    if (!reason) {
      showToast('Decline action canceled.');
      return;
    }

    try {
      await declinePaymentAsContractor({ paymentId, reason }).unwrap(); // ✅ Correct
      showToast('Payment declined successfully!');
    } catch (err) {
      console.error('Failed to decline payment:', err);
      showToast('Error declining payment.', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-600';
      case 'Declined':
      case 'DeclinedByContractor':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'AcceptedByContractor':
        return 'text-blue-600';
      case 'AwaitingAcknowledgment':
        return 'text-purple-600';
      case 'AwaitingConfirmation':
        return 'text-amber-500';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    showToast('Error loading payments.', 'error');
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500">Error loading payments.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 font-secondary">
      {/* Vital Message */}
      <div className="mb-6 border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-md shadow-sm">
        <p className="text-blue-900 text-sm">
          <strong>Vital Message:</strong> Monitor all payment statuses
          carefully. If a payment is declined, remember to note the reason for
          clear communication and record-keeping.
        </p>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table-auto w-full border border-gray-200">
          <thead className="bg-gradient-to-r from-green-50/60 to-green-50/40 text-gray-700 text-left">
            <tr>
              <th className="py-4 px-6">Project Name</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Currency</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  {/* Project Name */}
                  <td className="py-4 px-6 text-gray-700">
                    {typeof payment.contract === 'object' &&
                    'projectName' in payment.contract
                      ? payment.contract.projectName
                      : 'No contract info'}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6 text-gray-700">
                    {payment.amount.toLocaleString()}
                  </td>

                  {/* Currency */}
                  <td className="py-4 px-6 text-gray-700">
                    {payment.currency}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-gray-700">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td
                    className={`py-4 px-6 font-medium ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'Declined' ||
                            payment.status === 'DeclinedByContractor'
                          ? 'bg-red-100 text-red-800'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : payment.status === 'AcceptedByContractor'
                          ? 'bg-blue-100 text-blue-800'
                          : payment.status === 'AwaitingAcknowledgment'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                          
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    {/* Conditional Rendering Based on Status */}
                    {payment.status === 'AwaitingAcknowledgment' && (
                      <div className="space-x-2 flex justify-center">
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => handleAcknowledge(payment._id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDecline(payment._id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {/* {payment.status === 'AcceptedByContractor' && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleAcknowledge(payment._id)} // Assuming "Acknowledge" is the action
                      >
                        Confirm
                      </Button>
                    )} */}

                    {(payment.status === 'Confirmed' ||
                      payment.status === 'Declined' ||
                      payment.status === 'AcceptedByContractor'   ||
                      payment.status === 'DeclinedByContractor') && (
                      <span className="text-gray-500">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 px-6 text-center text-gray-500"
                >
                  No payments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ContractorPaymentList;
