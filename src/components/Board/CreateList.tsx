// src/components/CreateList.tsx

import React, { useState } from 'react';
import { useCreateListMutation } from '../../api/tasksApi';
import { useParams } from 'react-router-dom';

const CreateList: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [name, setName] = useState('');
  const [position, setPosition] = useState<number>(0);
  const [createList, { isLoading, error }] = useCreateListMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createList({ name, board: boardId!, position }).unwrap();
      setName('');
      setPosition(0);
      alert('List created successfully!');
    } catch (err) {
      console.error('Failed to create list:', err);
      alert('Error creating list.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New List</h2>
      <div>
        <label>List Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Position:</label>
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value, 10))}
          min="0"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create List'}
      </button>
       <p>Error creating list.</p>
    </form>
  );
};

export default CreateList;
