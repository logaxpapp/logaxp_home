import React from 'react';
import {
  useFetchPaymentsForContractQuery,
  useConfirmPaymentMutation,
  useDeclinePaymentMutation,
} from '../../../api/paymentApi';
import Button from '../../common/Button';

interface PaymentListProps {
  contractId: string | null;

}

const PaymentList: React.FC<PaymentListProps> = ({ contractId }) => {
  if (!contractId) {
    return <div>No contract selected to display payments.</div>;
  }

  const { data: payments, isLoading, error } = useFetchPaymentsForContractQuery(contractId);
  const [confirmPayment] = useConfirmPaymentMutation();
  const [declinePayment] = useDeclinePaymentMutation();

  const handleConfirm = async (paymentId: string) => {
    try {
      await confirmPayment(paymentId).unwrap();
      alert('Payment confirmed successfully!');
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      alert('Error confirming payment.');
    }
  };

  const handleDecline = async (paymentId: string) => {
    const notes = prompt('Please provide a reason for declining the payment:');
    if (!notes) return;

    try {
      await declinePayment({ paymentId, notes }).unwrap();
      alert('Payment declined successfully!');
    } catch (err) {
      console.error('Failed to decline payment:', err);
      alert('Error declining payment.');
    }
  };

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error loading payments.</div>;

  return (
    <div className="overflow-x-auto font-secondary">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Payment ID</th>
            <th className="py-2 px-4 border-b">Contractor</th>
            <th className="py-2 px-4 border-b">Amount ($)</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments?.map((payment) => (
            <tr key={payment._id} className="text-center">
              <td className="py-4 px-6 text-sm text-gray-700">
                  {typeof payment.contract === 'object' && 'projectName' in payment.contract
                    ? payment.contract.projectName
                    : 'No contract info'}
                </td>
              <td className="py-2 px-4 border-b">
                {typeof payment.contractor === 'object'
                    ? payment.contractor?.name // or any other property you want
                    : payment.contractor}
                </td>

              <td className="py-2 px-4 border-b">${payment.amount.toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(payment.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{payment.status}</td>
              <td className="py-2 px-4 border-b space-x-2">
                {payment.status === 'Pending' && (
                  <div className='space-x-2 flex justify-center'>
                    <Button variant="success" size="small" onClick={() => handleConfirm(payment._id)}>
                      Confirm
                    </Button>
                    <Button variant="danger" size="small" onClick={() => handleDecline(payment._id)}>
                      Decline
                    </Button>
                  </div>
                )}
                {payment.status !== 'Pending' && (
                    <span className="text-gray-500">No actions available</span>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
