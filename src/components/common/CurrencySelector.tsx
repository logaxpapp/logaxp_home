// src/components/common/CurrencySelector.tsx

import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const availableCurrencies = ['USD', 'EUR', 'GBP', 'NGN', 'JPY', 'CNY']; 

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="currency" className="text-gray-700 font-medium">
        Currency:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={handleChange}
        className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableCurrencies.map((curr) => (
          <option key={curr} value={curr}>
            {curr}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
