// src/components/Payments/CreatePayment.tsx

import React, { useState } from 'react';
import { useCreatePaymentMutation } from '../../../api/paymentApi';

interface CreatePaymentProps {
  contractorId: string;
  contractId: string;
}

const CreatePayment: React.FC<CreatePaymentProps> = ({ contractorId, contractId }) => {
  const [amount, setAmount] = useState('');
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // We only send contract, contractor, and amount
      await createPayment({
        contract: contractId,
        contractor: contractorId,
        amount: parseFloat(amount),
      }).unwrap();

      alert('Payment created successfully');
      setAmount(''); // Reset the input
    } catch (err) {
      console.error('Failed to create payment:', err);
      alert('Error creating payment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Create Payment</h2>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-gradient-to-t
 from-teal-600 via-cyan-900 to-gray-900  text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Payment'}
      </button>
    </form>
  );
};

export default CreatePayment;
