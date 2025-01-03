// src/components/Layout/Header.tsx

import React from 'react';
import CurrencySelector from '../../common/CurrencySelector';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">Payment Management System</h1>
      <CurrencySelector />
    </header>
  );
};

export default Header;
