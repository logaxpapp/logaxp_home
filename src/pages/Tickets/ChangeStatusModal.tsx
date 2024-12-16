// src/components/Ticket/ChangeStatusModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Feedback/Modal';
import Button from '../../components/common/Button/Button';
import { ITicket } from '../../types/ticket';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: (newStatus: ITicket['status']) => void;
  currentStatus: ITicket['status'];
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  onClose,
  onChangeStatus,
  currentStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ITicket['status']>(currentStatus);

  // Reset selectedStatus when the modal opens/closes or currentStatus changes
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const handleSubmit = () => {
    if (selectedStatus !== currentStatus) {
      onChangeStatus(selectedStatus);
    } else {
      onClose(); // No change needed
    }
  };

  return (
    <Modal
      isOpen={isOpen} // Pass the isOpen prop
      onClose={onClose}
      title="Change Ticket Status"
      footer={
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Change Status
          </Button>
        </div>
      }
    >
      <div className="mt-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Select New Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as ITicket['status'])}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </Modal>
  );
};

export default ChangeStatusModal;
