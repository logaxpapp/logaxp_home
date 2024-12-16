// src/components/Ticket/Modals/ConfirmDeleteModal.tsx
import React from 'react';
import Modal from '../../components/common/Feedback/Modal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-gray-700">{message}</p>
    <div className="mt-6 flex justify-end space-x-4">
      <button
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        onClick={onConfirm}
      >
        Delete
      </button>
    </div>
  </Modal>
);

export default ConfirmDeleteModal;
