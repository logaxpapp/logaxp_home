// src/context/CurrencyContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface CurrencyContextProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('USD'); // Default currency

  useEffect(() => {
    // Optionally, retrieve user preference from localStorage or API
    const storedCurrency = localStorage.getItem('preferredCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency); // Persist preference
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextProps => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
