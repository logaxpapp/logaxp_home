// src/components/Card/EditCardForm.tsx
import React, { useState } from 'react';
import { ICard } from '../../../types/task';
import { useUpdateCardMutation } from '../../../api/cardApi'; // <-- new cardApi
import { useToast } from '../../../features/Toast/ToastContext';
import { FiEdit } from 'react-icons/fi';

interface EditCardFormProps {
  card: ICard;
  onClose?: () => void; // if you want to close a modal after success
}

const EditCardForm: React.FC<EditCardFormProps> = ({ card, onClose }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const { showToast } = useToast();
  const [updateCard, { isLoading }] = useUpdateCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title cannot be empty.');
      return;
    }

    try {
      await updateCard({ _id: card._id, title, description }).unwrap();
      showToast('Card updated successfully!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Update card error:', error);
      showToast('Failed to update card.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <FiEdit />
        Edit Card
      </h2>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default EditCardForm;
