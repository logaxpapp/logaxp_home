import React, { useState } from 'react';
import {
  useFetchTeamByIdQuery,
  useAddMemberToTeamMutation,
  useRemoveMemberFromTeamMutation,
  useFetchAllUsersQuery,
} from '../../api/usersApi'; // Ensure correct path
import { IUser } from '../../types/user';
import { ITeamMember, TeamMemberRole } from '../../types/team';
import { FiTrash2 } from 'react-icons/fi';
import MultiSelect, { OptionType, GroupedOptionType } from './MultiSelect';
import { useToast } from '../../features/Toast/ToastContext';

interface TeamMembersSectionProps {
  teamId: string;
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({ teamId }) => {
  const { data: team, error, isLoading, refetch } = useFetchTeamByIdQuery(teamId);

  const { data: allUsersData, isLoading: usersLoading } = useFetchAllUsersQuery({ page: 1, limit: 1000 });
  const allUsers: IUser[] = allUsersData?.users || [];

  const [addMemberToTeam, { isLoading: isAdding }] = useAddMemberToTeamMutation();
  const [removeMemberFromTeam, { isLoading: isRemoving }] = useRemoveMemberFromTeamMutation();

  const { showToast } = useToast();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      const addPromises = selectedUserIds.map((userId) =>
        addMemberToTeam({ teamId, memberId: userId, role: 'Member' }).unwrap()
      );
      await Promise.all(addPromises);
      setSelectedUserIds([]);
      showToast('Members added to team successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to add members to team:', err);
      showToast(err?.data?.message || 'Error adding members to team.', 'error');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberFromTeam({ teamId, memberId }).unwrap();
      showToast('Member removed from team successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to remove member from team:', err);
      showToast(err?.data?.message || 'Error removing member from team.', 'error');
    }
  };

  const availableUsers = allUsers.filter(
    (user) => !team?.members.some((m: ITeamMember) => m.user._id === user._id)
  );

  const userOptions: OptionType[] = availableUsers.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
    group: 'Users',
  }));

  const groupedOptions: GroupedOptionType[] = [
    {
      label: 'Users',
      options: userOptions,
    },
  ];

  // Add console logs for debugging
  console.log('Team data:', team);
  if (team) {
    console.log('Team members:', team.members);
    team.members.forEach((member: ITeamMember) => {
      console.log('Member:', member);
      console.log('Member User:', member.user);
      console.log('Member Role:', member.role);
    });
  }

  if (isLoading || usersLoading) {
    return <p className="text-gray-500">Loading team members...</p>;
  }

  if (error) {
    console.error('Error loading team data:', error);
    return <p className="text-red-500">Failed to load team members.</p>;
  }

  if (!team) {
    return <p className="text-yellow-500">No team found.</p>;
  }

  return (
    <div className="border p-4 rounded-md bg-white shadow-sm max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>

      {/* Members List */}
      <ul className="mb-6">
        {team.members.map((member: ITeamMember) => (
          <li key={member.user._id} className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium">{member.user.name}</span>
              <span className="text-sm text-gray-500 ml-1">({member.user.email})</span>
              <span className="text-sm text-gray-500 ml-1"> - {member.role}</span>
            </div>
            <button
              onClick={() => handleRemoveMember(member.user._id)}
              disabled={isRemoving}
              className="text-red-500 hover:text-red-700"
              title="Remove Member"
            >
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>

      {/* Add Members to Team */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Add Members to Team</h3>
        <MultiSelect
          label="Select Users"
          options={groupedOptions}
          value={selectedUserIds}
          onChange={setSelectedUserIds}
          placeholder="Select users to add..."
          isDisabled={isAdding}
        />
        <button
          onClick={handleAddMembers}
          disabled={selectedUserIds.length === 0 || isAdding}
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
            selectedUserIds.length === 0 || isAdding ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAdding ? 'Adding...' : 'Add Members'}
        </button>
      </div>

      {/* Optional Refresh Button */}
      <button
        onClick={() => refetch()}
        className="text-blue-500 hover:underline text-sm"
      >
        Refresh Team Members
      </button>
    </div>
  );
};

export default TeamMembersSection;
