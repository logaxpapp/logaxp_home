// src/components/Team/AddMemberToTeam.tsx

import React, { useState } from 'react';
import { useAddMemberToTeamMutation, useFetchSubContractorsQuery } from '../../api/usersApi';
import { FiCheck, FiX } from 'react-icons/fi';

interface AddMemberToTeamProps {
  teamId: string;
  onClose: () => void;
}

const AddMemberToTeam: React.FC<AddMemberToTeamProps> = ({ teamId, onClose }) => {
  const [memberId, setMemberId] = useState('');
  const [role, setRole] = useState<'Leader' | 'Member' | 'Viewer'>('Member');
  const [addMember, { isLoading }] = useAddMemberToTeamMutation();
  const { data: subcontractors, error, isLoading: isSubLoading } = useFetchSubContractorsQuery();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) {
      alert('Please select a valid SubContractor.');
      return;
    }

    try {
      await addMember({ teamId, memberId, role }).unwrap();
      alert('Member added successfully!');
      onClose();
    } catch (err: any) {
      console.error('Failed to add member:', err);
      alert(`Failed to add member: ${(err as any).data?.message || 'Unknown error.'}`);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-4 text-gray-800">
      {/* Select SubContractor */}
      <div>
        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">Select SubContractor<span className="text-red-500">*</span></label>
        <select
          name="memberId"
          id="memberId"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">-- Select SubContractor --</option>
          {subcontractors && subcontractors.map(sub => (
            <option key={sub._id} value={sub._id}>
              {sub.name} ({sub.email})
            </option>
          ))}
        </select>
        {isSubLoading && <p>Loading SubContractors...</p>}
      
      </div>

      {/* Select Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role<span className="text-red-500">*</span></label>
        <select
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'Leader' | 'Member' | 'Viewer')}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="Member">Member</option>
          <option value="Leader">Leader</option>
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
          <FiCheck className="mr-2" /> {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AddMemberToTeam;
