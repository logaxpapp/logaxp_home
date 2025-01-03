// src/components/Team/EditMemberRole.tsx

import React, { useState } from 'react';
import { useUpdateMemberRoleMutation } from '../../api/usersApi';
import { FiCheck, FiX } from 'react-icons/fi';

interface EditMemberRoleProps {
  teamId: string;
  memberId: string;
  currentRole: 'Leader' | 'Member' | 'Viewer';
  onClose: () => void;
}

const EditMemberRole: React.FC<EditMemberRoleProps> = ({ teamId, memberId, currentRole, onClose }) => {
  const [newRole, setNewRole] = useState<'Leader' | 'Member' | 'Viewer'>(currentRole);
  const [updateMemberRole, { isLoading }] = useUpdateMemberRoleMutation();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole === currentRole) {
      alert('No changes detected.');
      return;
    }

    try {
      await updateMemberRole({ teamId, memberId, newRole }).unwrap();
      alert('Member role updated successfully!');
      onClose();
    } catch (err: any) {
      console.error('Failed to update member role:', err);
      alert(`Failed to update member role: ${(err as any).data?.message || 'Unknown error.'}`);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Select New Role */}
      <div>
        <label htmlFor="newRole" className="block text-sm font-medium text-gray-700">Select New Role<span className="text-red-500">*</span></label>
        <select
          name="newRole"
          id="newRole"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as 'Leader' | 'Member' | 'Viewer')}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="Leader">Leader</option>
          <option value="Member">Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          <FiX className="mr-2" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          <FiCheck className="mr-2" /> {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  );
};

export default EditMemberRole;
