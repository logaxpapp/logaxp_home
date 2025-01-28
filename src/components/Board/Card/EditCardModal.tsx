import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import {
  ICardWithListName,
  IUpdateCardInput,
} from '../../../types/task';
import {
  useUpdateCardMutation,
  useFetchAllCardsByBoardIdQuery,
} from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import DependencySelector from './DependencySelector';

interface EditCardModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  boardId: string;
  card: ICardWithListName;
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onRequestClose,
  card,
  boardId,
}) => {
  const [updateCard, { isLoading }] = useUpdateCardMutation();
  const { showToast } = useToast();

  // Local state
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [startDate, setStartDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState(card.priority);
  const [status, setStatus] = useState(card.status);
  const [progress, setProgress] = useState<number>(card.progress ?? 0);
  const [dependencies, setDependencies] = useState<string[]>(card.dependencies || []);

  // For dependency selection
  const { data: allCards, isLoading: isLoadingCards } = useFetchAllCardsByBoardIdQuery(boardId);

  // Resync whenever 'card' changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description ?? '');
    setStartDate(
      card.startDate ? new Date(card.startDate).toISOString().split('T')[0] : ''
    );
    setDueDate(
      card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
    );
    setPriority(card.priority);
    setStatus(card.status);
    setProgress(card.progress ?? 0);
    if (allCards) {
      const validDeps = card.dependencies?.filter((depId) =>
        allCards.some((c) => c._id === depId)
      );
      setDependencies(validDeps || []);
    }
  }, [card, allCards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // COMPARE OLD AND NEW VALUES
     // Compare old vs. new
  const oldProgress = card.progress ?? 0;
  if (progress < oldProgress) {
    showToast("Cannot decrease progress.", "error");
    return;
  } else if (progress > oldProgress) {
    const confirmed = window.confirm(
      `Are you sure you want to increase progress from ${oldProgress}% to ${progress}%?`
    );
    if (!confirmed) {
      return;
    }
  }

    // Validate date
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      showToast('Due date cannot be before start date.', 'error');
      return;
    }

    const updateData: IUpdateCardInput = {
      _id: card._id,
      boardId,
      title,
      description,
      priority,
      status,
      startDate: startDate || null,
      dueDate: dueDate || null,
      progress,
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
      <div className="p-4 text-gray-900">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-semibold">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-semibold">Progress</label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              {progress}%
            </p>
          </div>

          {/* Status & Priority */}
          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                placeholder="e.g. To Do, In Progress..."
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-sm font-semibold">
              Dependencies (other tasks that must finish first)
            </label>
            {isLoadingCards ? (
              <p className="text-sm mt-1">Loading available tasks...</p>
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
          <div className="flex justify-end space-x-2 mt-4">
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
