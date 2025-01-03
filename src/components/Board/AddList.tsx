// src/components/AddList.tsx

import React, { useState } from 'react';
import { useCreateListMutation } from '../../api/tasksApi';
import { useParams } from 'react-router-dom';
import { useToast } from '../../features/Toast/ToastContext';

const AddList: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();

  // Guard Clause
  if (!boardId) {
    return <p>Invalid board ID.</p>;
  }

  const [listName, setListName] = useState('');
  const [createList, { isLoading }] = useCreateListMutation();
  const { showToast } = useToast();

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) {
      showToast('List name cannot be empty.');
      return;
    }

    try {
      // Determine the position based on existing lists
      // This assumes that positions are numerical and incrementing
      // Adjust as per your backend logic
      const newListPosition = 0; // Replace with actual logic if necessary

      await createList({ name: listName, board: boardId, position: newListPosition }).unwrap();
      setListName('');
      showToast('List added successfully!');
    } catch (err) {
      console.error('Failed to add list:', err);
      showToast('Error adding list.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md flex flex-col">
      <form onSubmit={handleAddList}>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Enter list name"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add List'}
        </button>
      </form>
    </div>
  );
};

export default AddList;
