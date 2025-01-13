// src/components/Card/AddCardForm.tsx

import React, { useState } from 'react';
import { useCreateCardMutation,useFetchAllCardsByBoardIdQuery } from '../../../api/cardApi';
import { useFetchBoardByIdQuery } from '../../../api/tasksApi';
import { useToast } from '../../../features/Toast/ToastContext';
import DependencySelector from './DependencySelector'; // Ensure this component exists
import { ICreateCardInput } from '../../../types/task'; // Ensure correct import

interface AddCardFormProps {
  listId: string;   // The ID of the list to create under
  status: string;   // Possibly the status (or header)
  boardId: string; // New prop to fetch cards for dependency selection
  onClose: () => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({
  listId,
  status,
  onClose,
  boardId
}) => {
  const { showToast } = useToast();
  const [createCard, { isLoading }] = useCreateCardMutation();

  const { refetch: refetchBoard } = useFetchBoardByIdQuery(boardId);

  // Local form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(''); // store as string "YYYY-MM-DD"
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dependencies, setDependencies] = useState<string[]>([]); // New State for Dependencies

  // Fetch all cards for dependency selection
  // Replace 'your-board-id' with the actual board ID, possibly passed as a prop or from context
  const { data: allCards, isLoading: isLoadingCards } = useFetchAllCardsByBoardIdQuery(boardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title cannot be empty', 'error');
      return;
    }

    // Validate dates
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      showToast('Due date cannot be before start date.', 'error');
      return;
    }

    try {
      // Create the card input object
      const cardInput: ICreateCardInput = {
        title,
        description,
        list: listId,
        status,
        priority,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        dependencies, // Pass dependencies here
      };

      // Call the createCard mutation
      await createCard(cardInput).unwrap();

      showToast('Card created successfully!', 'success');
      onClose();
    } catch (err: any) {
      console.error('Create card error:', err);
      showToast(err.data?.message || 'Failed to create card', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-4 bg-white rounded text-gray-800  shadow'>
      <h2 className="font-semibold text-lg mb-2">Add New Task</h2>
      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex space-x-2 mb-2">
        {/* Start Date */}
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Due Date */}
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      {/* Priority */}
      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      {/* Dependencies */}
      <div className="mb-2">
        {isLoadingCards ? (
          <p>Loading available tasks...</p>
        ) : (
          <DependencySelector
            allCards={allCards || []}
            selectedDependencies={dependencies}
            currentTaskId={''} // Empty since it's a new task
            onChange={setDependencies}
          />
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default AddCardForm;
