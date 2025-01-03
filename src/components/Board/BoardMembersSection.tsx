// /src/components/BoardMembersSection.tsx

import React, { useState } from 'react';
import {
  useFetchBoardMembersQuery,
  useAddMemberToBoardMutation,
  useRemoveMemberFromBoardMutation,
} from '../../api/tasksApi';
import { IUser } from '../../types/user';
import { FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { useFetchTeamsQuery } from '../../api/usersApi';

/**
 * Props:
 * boardId: The ID of the board
 */
interface BoardMembersSectionProps {
  boardId: string;
}

const BoardMembersSection: React.FC<BoardMembersSectionProps> = ({ boardId }) => {
  // 1) Fetch the members
  const {
    data: members,
    error,
    isLoading,
    refetch,
  } = useFetchBoardMembersQuery(boardId, {
    // If you want to always re-fetch on mount:
    // refetchOnMountOrArgChange: true,
  });

  // 2) Setup mutation hooks
  const [addMemberToBoard, { isLoading: isAdding }] = useAddMemberToBoardMutation();
  const [removeMemberFromBoard, { isLoading: isRemoving }] =
    useRemoveMemberFromBoardMutation();

  // 3) Local state to handle adding a user
  const [newUserId, setNewUserId] = useState('');

  // 4) Event handlers
  const handleAddMember = async () => {
    if (!newUserId) return;
    try {
      await addMemberToBoard({ boardId, userId: newUserId }).unwrap();
      setNewUserId('');
    } catch (err: any) {
      console.error('Failed to add member:', err);
      // Optionally show toast
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberFromBoard({ boardId, userId }).unwrap();
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      // Optionally show toast
    }
  };

  // 5) Render loading/error states
  if (isLoading) {
    return <p className="text-gray-500">Loading board members...</p>;
  }
  if (error) {
    return <p className="text-red-500">Failed to load members.</p>;
  }
  if (!members) {
    return <p>No members found.</p>;
  }

  // 6) Main render
  return (
    <div className="border p-4 rounded-md bg-white shadow-sm max-w-md">
      <h2 className="text-lg font-semibold mb-2">Board Members</h2>

      {/* Members list */}
      <ul className="mb-4">
        {members.map((user: IUser) => (
          <li key={user._id} className="flex items-center justify-between mb-1">
            <div>
              <span className="font-medium">{user.name}</span> 
              <span className="text-sm text-gray-500 ml-1">({user.email})</span>
            </div>
            <button
              onClick={() => handleRemoveMember(user._id)}
              disabled={isRemoving}
              className="text-red-500 hover:text-red-700"
              title="Remove Member"
            >
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>

      {/* Add new member */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="User ID to add"
          className="border border-gray-300 p-2 rounded flex-grow"
        />
        <button
          onClick={handleAddMember}
          disabled={!newUserId || isAdding}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiUserPlus className="inline-block mr-1" />
          Add
        </button>
      </div>

      {/* Optional refresh button */}
      <button
        onClick={() => refetch()}
        className="mt-4 text-blue-500 hover:underline text-sm"
      >
        Refresh
      </button>
    </div>
  );
};

export default BoardMembersSection;
