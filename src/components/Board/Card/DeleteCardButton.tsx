// src/components/Card/DeleteCardButton.tsx
import React from 'react';
import { useDeleteCardMutation } from '../../../api/cardApi'; // <-- new cardApi
import { useToast } from '../../../features/Toast/ToastContext';
import { FiTrash2 } from 'react-icons/fi';

interface DeleteCardButtonProps {
  cardId: string;
}

const DeleteCardButton: React.FC<DeleteCardButtonProps> = ({ cardId }) => {
  const [deleteCard, { isLoading }] = useDeleteCardMutation();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await deleteCard({ cardId }).unwrap();
      showToast('Card deleted successfully!');
    } catch (error) {
      console.error('Delete card error:', error);
      showToast('Failed to delete card.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="inline-flex items-center text-red-600 hover:text-red-800"
    >
      <FiTrash2 className="mr-1" />
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default DeleteCardButton;
