import React, { useState } from 'react';
import { ICard } from '../../../types/task';
import { useUpdateCardMutation } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { FiEdit } from 'react-icons/fi';

interface EditCardFormProps {
  card: ICard;
  boardId: string;     // <-- Add this so we know which board to invalidate
  onClose?: () => void;
}

const EditCardForm: React.FC<EditCardFormProps> = ({ card, boardId, onClose }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(
    card.dueDate ? new Date(card.dueDate) : null
  );

  const { showToast } = useToast();
  const [updateCard, { isLoading }] = useUpdateCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Title cannot be empty.', 'error');
      return;
    }

    try {
      await updateCard({
        _id: card._id,
        boardId,                           // pass the boardId here
        title,
        description,
        dueDate: dueDate?.toISOString() || undefined,
      }).unwrap();

      showToast('Card updated successfully!', 'success');
      if (onClose) onClose();
    } catch (error) {
      console.error('Update card error:', error);
      showToast('Failed to update card.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 text-gray-700 dark:text-gray-200">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <FiEdit />
        Edit Card.....
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
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setDueDate(e.target.value ? new Date(e.target.value) : null)
          }
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
