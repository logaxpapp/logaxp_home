// src/components/DeleteMemberModal.tsx

import React from 'react';
import Modal from 'react-modal';
import { useDeleteUserMutation } from '../../api/usersApi'; // Ensure you have this mutation
import { useToast } from '../../features/Toast/ToastContext';
import { FiX, FiTrash2 } from 'react-icons/fi';

interface DeleteMemberModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  memberId: string;
  memberName: string;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ isOpen, onRequestClose, memberId, memberName }) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteUser(memberId).unwrap();
      showToast('Member deleted successfully!', 'success');
      onRequestClose();
    } catch (err: any) {
      console.error('Failed to delete member:', err);
      showToast(err?.data?.message || 'Error deleting member.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Member"
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Delete Member</h2>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete the member "<span className="font-semibold">{memberName}</span>"? This action cannot be undone.
      </p>
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
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
        >
          <FiTrash2 className="h-5 w-5 mr-1" />
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteMemberModal;
