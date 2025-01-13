import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { ICardWithListName, IUpdateCardInput } from '../../../types/task';
import { useUpdateCardMutation, useFetchAllCardsByBoardIdQuery } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import DependencySelector from './DependencySelector';

interface EditCardModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  boardId: string;             // Make sure you pass this in
  card: ICardWithListName;     // The card data
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onRequestClose,
  card,
  boardId, // We use this below
}) => {
  const [updateCard, { isLoading }] = useUpdateCardMutation();
  const { showToast } = useToast();

  // Local state
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [startDate, setStartDate] = useState<string>(
    card.startDate ? new Date(card.startDate).toISOString().split('T')[0] : ''
  );
  const [dueDate, setDueDate] = useState<string>(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  );
  const [priority, setPriority] = useState(card.priority);
  const [status, setStatus] = useState(card.status);
  const [dependencies, setDependencies] = useState<string[]>(card.dependencies || []);

  // For dependency selection
  const { data: allCards, isLoading: isLoadingCards } = useFetchAllCardsByBoardIdQuery(boardId);

  // Re-sync whenever 'card' changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description ?? '');
    setStartDate(card.startDate ? new Date(card.startDate).toISOString().split('T')[0] : '');
    setDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
    setPriority(card.priority);
    setStatus(card.status);
    if (allCards) {
      const validDeps = card.dependencies?.filter((depId) =>
        allCards.some((c) => c._id === depId)
      );
      setDependencies(validDeps || []);
    }
  }, [card, allCards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Date check
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      showToast('Due date cannot be before start date.', 'error');
      return;
    }

    const updateData: IUpdateCardInput = {
      _id: card._id,
      boardId, // crucial line
      title,
      description,
      priority,
      status,
      startDate: startDate || null,
      dueDate: dueDate || null,
      dependencies,
    };

    try {
      await updateCard(updateData).unwrap();
      showToast('Card updated successfully!', 'success');
      onRequestClose();
    } catch (err: any) {
      console.error('Failed to update card:', err);
      showToast(err.data?.message || 'Error updating card.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onRequestClose}>
      <div className="p-4 sidebar">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Card...</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div>
            <label className="block text-sm font-semibold">Status</label>
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Dependencies */}
          <div>
            {isLoadingCards ? (
              <p>Loading available tasks...</p>
            ) : (
              <DependencySelector
                allCards={allCards || []}
                selectedDependencies={dependencies}
                currentTaskId={card._id}
                onChange={setDependencies}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCardModal;
