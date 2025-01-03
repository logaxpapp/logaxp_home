// src/components/Admin/Contracts/ContractorPaymentSummary.tsx

import React, { useEffect, useState } from 'react';
import { useFetchPaymentSummaryQuery } from '../../../api/paymentApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { useConvertCurrencyMutation } from '../../../api/currencyApi';
import { useFetchContractByIdQuery } from '../../../api/contractApi';
import CurrencySelector from '../../common/CurrencySelector';

interface ContractorPaymentSummaryProps {
  contractId: string;
}

const ContractorPaymentSummary: React.FC<ContractorPaymentSummaryProps> = ({ contractId }) => {
  const { data, isLoading, error } = useFetchPaymentSummaryQuery(contractId);
  const {
    data: contractData,
    isLoading: isContractLoading,
    error: contractError,
  } = useFetchContractByIdQuery(contractId);
  const { showToast } = useToast();
  const { currency: selectedCurrency } = useCurrency();
  const [convertCurrency] = useConvertCurrencyMutation();

  const [convertedAmounts, setConvertedAmounts] = useState({
    totalCost: 0,
    totalPaid: 0,
    balance: 0,
  });

  useEffect(() => {
    const convertAmounts = async () => {
      if (data) {
        const originalCurrency = data.currency || 'USD';

        if (originalCurrency !== selectedCurrency) {
          try {
            const [newTotalCost, newTotalPaid, newBalance] = await Promise.all([
              convertCurrency({
                amount: data.totalCost,
                fromCurrency: originalCurrency,
                toCurrency: selectedCurrency,
              }).unwrap(),
              convertCurrency({
                amount: data.totalPaid,
                fromCurrency: originalCurrency,
                toCurrency: selectedCurrency,
              }).unwrap(),
              convertCurrency({
                amount: data.balance,
                fromCurrency: originalCurrency,
                toCurrency: selectedCurrency,
              }).unwrap(),
            ]);

            setConvertedAmounts({
              totalCost: newTotalCost.amount,
              totalPaid: newTotalPaid.amount,
              balance: newBalance.amount,
            });
          } catch (err) {
            console.error('Error converting currencies:', err);
            showToast('Error converting currencies.', 'error');
          }
        } else {
          setConvertedAmounts({
            totalCost: data.totalCost,
            totalPaid: data.totalPaid,
            balance: data.balance,
          });
        }
      }
    };

    convertAmounts();
  }, [data, selectedCurrency, convertCurrency, showToast]);

  if (isLoading || isContractLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Loading summary...</p>
      </div>
    );
  }

  if (error || !data || contractError) {
    showToast('Error loading summary.', 'error');
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500">Error loading summary.</p>
      </div>
    );
  }

  const { projectName, description, status } = contractData || {};
  const { totalCost, totalPaid, balance } = convertedAmounts;

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Vital Message */}
      <div className="mb-6 border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-md shadow-sm">
        <p className="text-blue-900 text-sm">
          <strong>Vital Message:</strong> The amounts displayed below may vary
          based on the selected currency’s exchange rate. Always verify with
          your finance manager for the most accurate figures.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {projectName || 'Unnamed Project'}
            </h2>
            <p className="text-sm text-gray-500 mt-1 w-full md:w-5/6">
              {description || 'No description available.'}
            </p>
            <span
              className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {status || 'Unknown Status'}
            </span>
          </div>

          {/* Currency Selector */}
          <div className="w-32">
            <CurrencySelector />
          </div>
        </div>

        {/* Payment Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Cost */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center shadow-sm">
            <p className="text-gray-600 uppercase text-sm font-medium">
              Total Cost
            </p>
            <p className="text-base font-bold text-blue-700 mt-2">
              {selectedCurrency}{' '}
              {totalCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Total Paid */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center shadow-sm">
            <p className="text-gray-600 uppercase text-sm font-medium">
              Total Paid
            </p>
            <p className="text-base font-bold text-green-700 mt-2">
              {selectedCurrency}{' '}
              {totalPaid.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Balance */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center shadow-sm">
            <p className="text-gray-600 uppercase text-sm font-medium">
              Balance
            </p>
            <p
              className={`text-base font-bold mt-2 ${
                balance < 0 ? 'text-red-600' : 'text-green-700'
              }`}
            >
              {selectedCurrency}{' '}
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractorPaymentSummary;
