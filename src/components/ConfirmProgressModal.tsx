// src/components/ConfirmProgressModal.tsx

import React from "react";
import Modal from "./Modal"; // Ensure the correct path based on your project structure

interface ConfirmProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
  newProgress: number;
}

const ConfirmProgressModal: React.FC<ConfirmProgressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskName,
  newProgress,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 text-gray-800 dark:text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Confirm Progress Update</h2>
        <p>
          Do you want to update the progress of <strong>{taskName}</strong> to{" "}
          <strong>{newProgress}%</strong>?
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmProgressModal;
