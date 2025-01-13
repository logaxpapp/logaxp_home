import React, { useState } from 'react';
import { ICard, ISubTask } from '../../../types/task';
import {
  useAddSubTaskMutation,
  useUpdateSubTaskByIdMutation,
  useDeleteSubTaskByIdMutation,
} from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { FiCheckSquare, FiTrash2, FiPlus, FiEye } from 'react-icons/fi';

interface SubTaskSectionProps {
  card: ICard;
}

const SubTaskSection: React.FC<SubTaskSectionProps> = ({ card }) => {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const { showToast } = useToast();

  const [addSubTask] = useAddSubTaskMutation();
  const [updateSubTaskById] = useUpdateSubTaskByIdMutation();
  const [deleteSubTaskById] = useDeleteSubTaskByIdMutation();

  const handleAddSubTask = async () => {
    if (!newSubTaskTitle.trim()) {
      showToast('Sub-task title cannot be empty.', 'error');
      return;
    }
    try {
      await addSubTask({
        cardId: card._id,
        subTask: { title: newSubTaskTitle, completed: false },
      }).unwrap();
      setNewSubTaskTitle('');
      showToast('Sub-task added successfully!', 'success');
    } catch (error) {
      console.error('Add sub-task error:', error);
      showToast('Failed to add sub-task.', 'error');
    }
  };

  const handleToggleComplete = async (subTaskId: string, completed: boolean) => {
    try {
      await updateSubTaskById({
        cardId: card._id,
        subTaskId,
        updates: { completed: !completed },
      }).unwrap();
      console.log(subTaskId)
      showToast('Sub-task updated successfully!', 'success');
    } catch (error) {
      console.error('Update sub-task error:', error);
      showToast('Failed to update sub-task.', 'error');
    }
  };

  const handleDeleteSubTask = async (subTaskId: string) => {
    if (!window.confirm('Are you sure you want to delete this sub-task?')) return;
    try {
      await deleteSubTaskById({
        cardId: card._id,
        subTaskId,
      }).unwrap();
      showToast('Sub-task deleted successfully!', 'success');
    } catch (error) {
      console.error('Delete sub-task error:', error);
      showToast('Failed to delete sub-task.', 'error');
    }
  };

  return (
    <div className="p-4 text-gray-800 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiCheckSquare className="text-green-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Sub-Tasks</h3>
      </div>

      {/* Add Sub-Task Section */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Add New Sub-Task</h4>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter sub-task title"
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            className="flex-1 p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={handleAddSubTask}
            className={`flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              !newSubTaskTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiPlus />
            <span className="ml-2">Add Sub-Task</span>
          </button>
        </div>
      </div>

      {/* List Sub-Tasks */}
      <div className="space-y-4">
        {card.subTasks?.length ? (
          card.subTasks.map((sub) => (
            <div
              key={sub.id}
              className="flex justify-between items-center p-3 border rounded-md shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => handleToggleComplete(sub.id, sub.completed)}
                  className="accent-green-600"
                />
                <span
                  className={`${
                    sub.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  } text-sm font-medium`}
                >
                  {sub.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => console.log('View details:', sub.id)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiEye />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDeleteSubTask(sub.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-sm">No sub-tasks available. Add one above to get started!</p>
        )}
      </div>
    </div>
  );
};

export default SubTaskSection;
