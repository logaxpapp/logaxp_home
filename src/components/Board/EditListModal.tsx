// src/components/EditListModal.tsx

import React, { useState, useEffect } from 'react';
import CustomModal from './CustomModal';
import { IList } from '../../types/task';
import { useUpdateListMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';
import { FiX, FiCheck } from 'react-icons/fi';

interface EditListModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  list: IList;
}

const EditListModal: React.FC<EditListModalProps> = ({ isOpen, onRequestClose, list }) => {
  const [listName, setListName] = useState(list.name);
  const [updateList, { isLoading }] = useUpdateListMutation();
  const { showToast } = useToast();

  useEffect(() => {
    setListName(list.name);
  }, [list.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };

  const handleUpdateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) {
      showToast('List name cannot be empty.', 'error');
      return;
    }

    try {
      await updateList({ _id: list._id, name: listName }).unwrap();
      showToast('List updated successfully!', 'success');
      onRequestClose();
    } catch (err: any) {
      console.error('Failed to update list:', err);
      showToast(err?.data?.message || 'Error updating list.', 'error');
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit List"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit List</h2>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleUpdateList}>
        <div className="mb-4">
          <label htmlFor="listName" className="block text-gray-700 mb-2">
            List Name
          </label>
          <input
            type="text"
            id="listName"
            value={listName}
            onChange={handleNameChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
          >
            <FiX className="h-5 w-5 mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <FiCheck className="h-5 w-5 mr-1" />
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditListModal;
