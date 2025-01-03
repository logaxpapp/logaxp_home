// src/components/Board/ColumnHeader.tsx

import React, { useState } from 'react';
import AddCardForm from './AddCardForm';

interface ColumnHeaderProps {
  listId: string;
  headerName: string;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ listId, headerName }) => {
  const [isAdding, setIsAdding] = useState(false);

  const toggleAddCard = () => {
    setIsAdding(!isAdding);
  };

  return (
    <div className="flex justify-between items-center p-2 bg-gray-200">
      <h2 className="text-lg font-semibold">{headerName}</h2>
      <button
        onClick={toggleAddCard}
        className="text-sm text-blue-500 hover:underline"
      >
        {isAdding ? 'Cancel' : 'Add Card'}
      </button>
      
    </div>
  );
};

export default ColumnHeader;
