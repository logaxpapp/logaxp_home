// src/components/EditMemberModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { IUser, UserRole } from '../../types/user';
import { useUpdateUserMutation } from '../../api/usersApi'; // Ensure you have this mutation
import { useToast } from '../../features/Toast/ToastContext';
import { FiX, FiCheck } from 'react-icons/fi';

interface EditMemberModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  member: IUser;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onRequestClose, member }) => {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [role, setRole] = useState(member.role);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showToast } = useToast();

  useEffect(() => {
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
  }, [member]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email cannot be empty.', 'error');
      return;
    }

    try {
      await updateUser({ _id: member._id, name, email, role }).unwrap();
      showToast('Member updated successfully!', 'success');
      onRequestClose();
    } catch (err: any) {
      console.error('Failed to update member:', err);
      showToast(err?.data?.message || 'Error updating member.', 'error');
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UserRole; // Ensure value matches UserRole
    setRole(value);
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Member"
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Member</h2>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="memberName" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="memberName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="memberEmail" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="memberEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="memberRole" className="block text-gray-700 mb-2">
            Role
          </label>
          <select
        id="memberRole"
        value={role}
        onChange={handleRoleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <option value="Admin">Admin</option>
        <option value="Support">Support</option>
        <option value="User">User</option>
        <option value="Approver">Approver</option>
        <option value="Contractor">Contractor</option>
        </select>

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
    </Modal>
  );
};

export default EditMemberModal;
