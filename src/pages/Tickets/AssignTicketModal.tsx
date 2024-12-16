// src/components/Ticket/Modals/AssignTicketModal.tsx
import React from 'react';
import Modal from '../../components/common/Feedback/Modal';
import SingleSelect from '../../components/common/Input/SelectDropdown/SingleSelect';
import { IUser } from '../../types/user';
import { OptionType } from '../../components/common/Input/SelectDropdown/SingleSelect';

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: IUser[];
  isLoading: boolean;
  selectedUserId: string | null;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
  onAssign: () => void;
  ticketTitle: string;
}

const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  isOpen,
  onClose,
  users,
  isLoading,
  selectedUserId,
  setSelectedUserId,
  onAssign,
  ticketTitle,
}) => {
  const userOptions: OptionType[] = users.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Ticket: ${ticketTitle}`}>
      <div className="space-y-4">
        <p>Select a user to assign this ticket to:</p>
        {isLoading ? (
          <div>Loading users...</div>
        ) : (
          <SingleSelect
            options={userOptions}
            value={selectedUserId}
            onChange={setSelectedUserId}
            placeholder="Select a user..."
          />
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onAssign}
          disabled={!selectedUserId || isLoading}
        >
          Assign
        </button>
      </div>
    </Modal>
  );
};

export default AssignTicketModal;
