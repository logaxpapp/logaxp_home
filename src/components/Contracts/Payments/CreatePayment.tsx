// src/components/Payments/CreatePayment.tsx

import React, { useState, useEffect } from 'react';
import { useCreatePaymentMutation } from '../../../api/paymentApi';
import { useGetExchangeRatesQuery, useConvertCurrencyMutation } from '../../../api/currencyApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { useCurrency } from '../../../context/CurrencyContext';

interface CreatePaymentProps {
  contractorId: string;
  contractId: string;
}

const CreatePayment: React.FC<CreatePaymentProps> = ({ contractorId, contractId }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const { showToast } = useToast();
  const { currency: selectedCurrency } = useCurrency();
  const { data: exchangeRates } = useGetExchangeRatesQuery(currency);
  const [convertCurrency] = useConvertCurrencyMutation();

  useEffect(() => {
    // Define supported currencies or fetch from an API
    setAvailableCurrencies(['USD', 'EUR', 'GBP', 'NGN', 'JPY', 'CNY']); // Expand as needed
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount <= 0) {
      showToast('Please enter a valid amount.');
      return;
    }

    try {
      // Optionally, convert to base currency if needed
      // const baseCurrency = 'USD';
      // const convertedAmount = await convertCurrency({
      //   amount: parsedAmount,
      //   fromCurrency: currency,
      //   toCurrency: baseCurrency,
      // }).unwrap();

      await createPayment({
        contract: contractId,
        contractor: contractorId,
        amount: parsedAmount,
        currency,
      }).unwrap();

      showToast('Payment created successfully!');
      setAmount(''); // Reset the input
      setCurrency('USD'); // Reset currency to default
    } catch (err: any) {
      console.error('Failed to create payment:', err);
      showToast(err.data?.message || 'Error creating payment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold">Create Payment</h2>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {availableCurrencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-gradient-to-t from-teal-600 via-cyan-900 to-gray-900 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition duration-200"
      >
        {isLoading ? 'Creating...' : 'Create Payment'}
      </button>
    </form>
  );
};

export default CreatePayment;
