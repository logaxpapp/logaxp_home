// src/components/Board/ProgressConfirmModal.tsx

import React from 'react';
import Modal from 'react-modal'; // Or whatever modal library you use

interface ProgressConfirmModalProps {
  isOpen: boolean;
  oldProgress: number;
  newProgress: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ProgressConfirmModal: React.FC<ProgressConfirmModalProps> = ({
  isOpen,
  oldProgress,
  newProgress,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirm Progress"
      style={{
        overlay: { zIndex: 1000 },
        content: { maxWidth: 400, margin: 'auto' },
      }}
    >
      <h2 className="text-lg font-semibold mb-4">
        Confirm Progress Update
      </h2>
      <p>
        You are changing progress from <strong>{oldProgress}%</strong> to{' '}
        <strong>{newProgress}%</strong>. Continue?
      </p>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ProgressConfirmModal;
