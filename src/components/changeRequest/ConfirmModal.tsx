import React, { useState } from 'react';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for deletion.');
      return;
    }
    onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700">{message}</p>
      <textarea
        className="w-full mt-4 p-2 border rounded-md"
        rows={3}
        placeholder="Enter reason for deletion..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
