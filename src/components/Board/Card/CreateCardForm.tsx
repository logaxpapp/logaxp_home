// src/components/Card/CreateCardForm.tsx
import React, { useState } from 'react';
import { useCreateCardMutation } from '../../../api/cardApi'; // <-- new cardApi
import { useToast } from '../../../features/Toast/ToastContext';
import { FiPlusCircle } from 'react-icons/fi';

interface CreateCardFormProps {
  listId: string;   // The list ID to which the card belongs
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ listId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { showToast } = useToast();

  // From cardApi, not tasksApi
  const [createCard, { isLoading }] = useCreateCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title cannot be empty.');
      return;
    }

    try {
      await createCard({ title, description, list: listId }).unwrap();
      setTitle('');
      setDescription('');
      showToast('Card created successfully!');
    } catch (error) {
      console.error('Create card error:', error);
      showToast('Failed to create card.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <FiPlusCircle />
        Create New Card
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
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? 'Creating...' : 'Create Card'}
      </button>
    </form>
  );
};

export default CreateCardForm;
