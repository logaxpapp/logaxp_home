import React, { useState } from 'react';
import { useDeleteListMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';

interface DeleteListButtonProps {
  listId: string;
}

const DeleteListButton: React.FC<DeleteListButtonProps> = ({ listId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteList, { isLoading }] = useDeleteListMutation();
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteList(listId).unwrap();
      showToast('List deleted successfully!');
      setIsModalOpen(false); // Close modal after deletion
    } catch (err) {
      console.error('Failed to delete list:', err);
      showToast('Error deleting list.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-red-500 hover:text-red-700"
      >
        Delete List
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this list? This will also delete all associated cards.</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteListButton;
