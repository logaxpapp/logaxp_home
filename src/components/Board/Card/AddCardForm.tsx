// src/components/Card/AddCardForm.tsx

import React, { useState } from 'react';
import { useCreateCardMutation } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';

interface AddCardFormProps {
  listId: string;   // The ID of the list we're adding a card to
  status: string;   // Derived from the column header
  onClose: () => void; // Function to close the modal
}

const AddCardForm: React.FC<AddCardFormProps> = ({ listId, status, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium'); // Retain priority selection
  const { showToast } = useToast();

  const [createCard, { isLoading }] = useCreateCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title cannot be empty.', 'error');
      return;
    }

    try {
      await createCard({ 
        title, 
        description, 
        list: listId, 
        status,         // Use the passed status
        priority 
      }).unwrap();
      setTitle('');
      setDescription('');
      setPriority('Medium');
      showToast('Task created successfully!', 'success');
      onClose(); // Close the modal after successful creation
    } catch (err: any) {
      console.error('Failed to create task:', err);
      showToast(err?.data?.message || 'Error creating task.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Title */}
      <div>
        <label htmlFor="title" className="block text-sm md:text-base font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm md:text-base font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
        />
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm md:text-base font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm md:text-base font-medium text-white shadow-sm ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default AddCardForm;
