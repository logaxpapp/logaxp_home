import React from 'react';
import {
  useFetchPaymentsForContractQuery,
  useAcceptPaymentAsContractorMutation,
  useDeclinePaymentAsContractorMutation,
} from '../../../api/paymentApi';
import Button from '../../common/Button';
import { useToast } from '../../../features/Toast/ToastContext';
import { IPayment } from '../../../types/payment';

interface ContractorPaymentListProps {
  contractId: string;
}

const ContractorPaymentList: React.FC<ContractorPaymentListProps> = ({ contractId }) => {
  const { data: payments, isLoading, error } = useFetchPaymentsForContractQuery(contractId);
  const [acceptPayment] = useAcceptPaymentAsContractorMutation();
  const [declinePayment] = useDeclinePaymentAsContractorMutation();

  const { showToast } = useToast();

  const handleAccept = async (paymentId: string) => {
    try {
      await acceptPayment(paymentId).unwrap();
      showToast('Payment accepted successfully!');
    } catch (err) {
      console.error('Failed to accept payment:', err);
      showToast('Error accepting payment.');
    }
  };

  const handleDecline = async (paymentId: string) => {
    const reason = window.prompt('Please provide a reason for declining the payment:');
    if (!reason) {
      showToast('Decline action canceled.');
      return;
    }

    try {
      await declinePayment({ paymentId, reason }).unwrap();
      showToast('Payment declined successfully!');
    } catch (err) {
      console.error('Failed to decline payment:', err);
      showToast('Error declining payment.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-600';
      case 'Declined':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-700">Loading payments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-600">Error loading payments.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto font-secondary">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Name
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount ($)
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {payments && payments.length > 0 ? (
            payments.map((payment: IPayment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-700">
                  {typeof payment.contract === 'object' && 'projectName' in payment.contract
                    ? payment.contract.projectName
                    : 'No contract info'}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className={`py-4 px-6 text-sm font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </td>
                <td className="py-4 px-6 text-sm text-center">
                  {payment.status === 'Pending' && (
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleAccept(payment._id)}
                        aria-label={`Accept payment ${payment._id}`}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDecline(payment._id)}
                        aria-label={`Decline payment ${payment._id}`}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                  {payment.status !== 'Pending' && (
                    <span className="text-gray-500">No actions available</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 px-6 text-center text-sm text-gray-500">
                No payments available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContractorPaymentList;
