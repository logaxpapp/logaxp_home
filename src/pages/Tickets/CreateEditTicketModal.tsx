// src/components/Ticket/Modals/CreateEditTicketModal.tsx
import React from 'react';
import Modal from '../../components/common/Feedback/Modal';
import NewTicketForm from './NewTicketForm';
import { ITicket } from '../../types/ticket';

interface CreateEditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ticket?: ITicket | null;
}

const CreateEditTicketModal: React.FC<CreateEditTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ticket,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={ticket ? 'Edit Ticket' : 'Create New Ticket'}>
    <NewTicketForm onClose={onClose} onSuccess={onSuccess} ticket={ticket || undefined} />
  </Modal>
);

export default CreateEditTicketModal;
