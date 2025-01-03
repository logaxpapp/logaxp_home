// src/components/Card/EditCardModal.tsx

import React, { useState } from 'react';
import Modal from '../Modal'; // Ensure the path is correct
import { ICardWithListName } from '../../../types/task';
import { useUpdateCardMutation } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';

interface EditCardModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  card: ICardWithListName;
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onRequestClose,
  card,
}) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [status, setStatus] = useState(card.status);
  const [priority, setPriority] = useState(card.priority);
  const { showToast } = useToast();

  const [updateCard, { isLoading }] = useUpdateCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title cannot be empty.', 'error');
      return;
    }

    try {
      await updateCard({
        _id: card._id,
        title,
        description,
        status,
        priority,
      }).unwrap();
      showToast('Task updated successfully!', 'success');
      onRequestClose();
    } catch (err: any) {
      console.error('Failed to update task:', err);
      showToast(err?.data?.message || 'Error updating task.', 'error');
    }
  };

  return (
    <Modal onClose={onRequestClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm md:text-base font-medium text-gray-700">
              Task Title
            </label>
            <input
              type="text"
              id="title"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
              rows={4}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm md:text-base font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
              required
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
              required
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCardModal;
