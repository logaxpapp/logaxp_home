// src/components/Admin/Contracts/PaymentList.tsx

import React, { useState } from 'react';
import {
  useFetchPaymentsForContractQuery,
  useConfirmPaymentMutation,
  useDeclinePaymentMutation,
  useSendPaymentMutation,
  useDeletePaymentMutation,
  useEditPaymentMutation,
} from '../../../api/paymentApi';
import { useToast } from '../../../features/Toast/ToastContext';
import Button from '../../common/Button';
import Modal from './Modal'; // Ensure you have a Modal component

import { IPayment } from '../../../types/payment';

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
  const [sendPayment] = useSendPaymentMutation();
  const [deletePayment] = useDeletePaymentMutation(); // New
  const [editPayment] = useEditPaymentMutation();     // New
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<IPayment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<IPayment>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSend = async (paymentId: string) => {
    try {
      await sendPayment(paymentId).unwrap();
      showToast('Payment sent successfully!');
    } catch (err) {
      console.error('Failed to send payment:', err);
      showToast('Error sending payment.', 'error');
    }
  };

  const filteredPayments = payments?.filter((payment) =>
    payment._id.includes(searchTerm) ||
    (typeof payment.contractor === 'object'
      ? payment.contractor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      : payment.contractor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirm = async (paymentId: string) => {
    try {
      await confirmPayment(paymentId).unwrap();
      showToast('Payment confirmed successfully!');
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      showToast('Error confirming payment.', 'error');
    }
  };

  const handleDecline = async (paymentId: string) => {
    const notes = window.prompt('Please provide a reason for declining the payment:');
    if (!notes) {
      showToast('Decline action canceled.');
      return;
    }

    try {
      await declinePayment({ paymentId, notes }).unwrap();
      showToast('Payment declined successfully!');
    } catch (err) {
      console.error('Failed to decline payment:', err);
      showToast('Error declining payment.', 'error');
    }
  };

  const handleDelete = async (paymentId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await deletePayment(paymentId).unwrap();
      showToast('Payment deleted successfully!');
    } catch (err) {
      console.error('Failed to delete payment:', err);
      showToast('Error deleting payment.', 'error');
    }
  };

  const handleEdit = (payment: IPayment) => {
    if (payment.status === 'Confirmed') {
      showToast('Cannot edit a confirmed payment.', 'error');
      return;
    }
    setCurrentPayment(payment);
    setEditFormData({
      amount: payment.amount,
      currency: payment.currency,
      notes: payment.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const submitEdit = async () => {
    if (!currentPayment) return;

    try {
      await editPayment({
        paymentId: currentPayment._id,
        updateData: editFormData,
      }).unwrap();
      showToast('Payment updated successfully!');
      setIsEditModalOpen(false);
      setCurrentPayment(null);
    } catch (err) {
      console.error('Failed to edit payment:', err);
      showToast('Error editing payment.', 'error');
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
    <div className="overflow-x-auto font-secondary">
      {/* **Search Input** */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Payment ID or Contractor Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

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
          {filteredPayments?.map((payment) => (
            <tr key={payment._id} className="text-center">
              <td className="py-4 px-6 text-sm text-gray-700">
                {typeof payment.contract === 'object' && 'projectName' in payment.contract
                  ? payment.contract.projectName
                  : 'No contract info'}
              </td>
              <td className="py-2 px-4 border-b">
                {typeof payment.contractor === 'object'
                  ? payment.contractor?.name // Adjust based on your data structure
                  : payment.contractor}
              </td>

              <td className="py-2 px-4 border-b">${payment.amount.toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(payment.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
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
              <td className="py-2 px-4 border-b space-x-2 text-center">
                {/* Conditional Rendering Based on Status */}
                {payment.status === 'Pending' ? (
                  <div className="space-x-2 flex justify-center">
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleSend(payment._id)}
                    >
                      Send
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDecline(payment._id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : payment.status === 'AcceptedByContractor' ? (
                  <div className="space-x-2 flex justify-center">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleConfirm(payment._id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className="space-x-2 flex justify-center">
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => handleEdit(payment)}
                      disabled={payment.status === 'Confirmed'}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </Button>
                    <span className="text-gray-500">No actions available</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* **Edit Modal** */}
      {isEditModalOpen && currentPayment && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-lg font-semibold mb-4">Edit Payment</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitEdit();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                value={editFormData.amount}
                onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={editFormData.currency}
                onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
                {/* Add other supported currencies */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PaymentList;
