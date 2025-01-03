// src/components/BoardTeamMember.tsx

import React from 'react';
import { IUser } from '../../../types/user';
import { FiUser } from 'react-icons/fi';

interface BoardTeamMemberProps {
  members: IUser[];
  selectedUserId: string;
  onSelect: (userId: string) => void;
  placeholder?: string;
}

const BoardTeamMember: React.FC<BoardTeamMemberProps> = ({
  members,
  selectedUserId,
  onSelect,
  placeholder = 'Select a team member',
}) => {
  return (
    <div className="relative">
      <select
        value={selectedUserId}
        onChange={(e) => onSelect(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name} ({member.email})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FiUser />
      </div>
    </div>
  );
};

export default BoardTeamMember;
