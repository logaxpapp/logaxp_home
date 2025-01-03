// src/components/common/ConfirmationModal.tsx

import React from 'react';
import Button from '../../common/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-96">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="px-6 py-4 flex justify-end">
          <Button variant="secondary" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
