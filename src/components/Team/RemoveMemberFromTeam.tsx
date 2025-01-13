// src/components/Team/RemoveMemberFromTeam.tsx

import React from 'react';
import { useRemoveMemberFromTeamMutation } from '../../api/usersApi';
import { FiTrash2, FiX } from 'react-icons/fi';

interface RemoveMemberFromTeamProps {
  teamId: string;
  memberId: string;
  memberName: string;
  memberRole: 'Leader' | 'Member' | 'Viewer';
  onClose: () => void;
}

const RemoveMemberFromTeam: React.FC<RemoveMemberFromTeamProps> = ({
  teamId,
  memberId,
  memberName,
  memberRole,
  onClose,
}) => {
  const [removeMember, { isLoading }] = useRemoveMemberFromTeamMutation();

  const handleRemove = async () => {
    if (!memberId.trim()) {
      alert('Invalid SubContractor ID.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to remove ${memberName} (${memberRole}) from the team?`
      )
    ) {
      return;
    }

    try {
      await removeMember({ teamId, memberId }).unwrap();
      alert('Member removed successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to remove member:', err);
      alert('Failed to remove member.');
    }
  };

  return (
    <div className="space-y-4 text-gray-800">
      <p>
        Are you sure you want to remove <strong>{memberName}</strong> (
        {memberRole}) from the team?
      </p>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          <FiX className="mr-2" /> Cancel
        </button>
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <FiTrash2 className="mr-2" /> {isLoading ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default RemoveMemberFromTeam;
