import React, { useState } from 'react';
import {
  // Board membership hooks
  useFetchBoardMembersQuery,
  useAddMemberToBoardMutation,
  useRemoveMemberFromBoardMutation,
  // Team<->Board relationship (if supported by the backend)
  useSetBoardTeamMutation,
  useRemoveBoardTeamMutation,
} from '../../api/tasksApi';
import {
  // Team hooks
  useFetchTeamsQuery,
  useFetchAllUsersQuery,
  useCreateUserMutation,
  useAddMemberToTeamMutation,
} from '../../api/usersApi';
import { IUser } from '../../types/user';
import { ITeam } from '../../types/team';

import MultiSelect, { OptionType, GroupedOptionType } from './MultiSelect';
import TeamMembersSection from './TeamMembersSection';
import { useToast } from '../../features/Toast/ToastContext';

import { FiTrash2 } from 'react-icons/fi';

interface BoardMembersSectionProps {
  boardId: string;
}

const BoardMembersSection: React.FC<BoardMembersSectionProps> = ({ boardId }) => {
  /*****************************************************************
   * 1) Data Fetching
   *****************************************************************/
  const { data: members, error, isLoading, refetch } = useFetchBoardMembersQuery(boardId);

  const { data: allUsersData, error: usersError, isLoading: usersLoading } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000,
  });
  const allUsers: IUser[] = allUsersData?.users || [];

  const { data: teamsData, error: teamsError, isLoading: teamsLoading } = useFetchTeamsQuery({
    page: 1,
    limit: 1000,
  });
  const allTeams: ITeam[] = teamsData?.teams || [];

  /*****************************************************************
   * 2) Mutations
   *****************************************************************/
  const [addMemberToBoard, { isLoading: isAddingToBoard }] = useAddMemberToBoardMutation();
  const [removeMemberFromBoard, { isLoading: isRemovingFromBoard }] = useRemoveMemberFromBoardMutation();
  const [createUser] = useCreateUserMutation();

  // If your backend supports “team to board” linking
  const [setBoardTeam, { isLoading: isSettingBoardTeam }] = useSetBoardTeamMutation();
  const [removeBoardTeam, { isLoading: isRemovingBoardTeam }] = useRemoveBoardTeamMutation();

  // Only used if you still allow adding members to teams from this component
  const [addMemberToTeam, { isLoading: isAddingToTeam }] = useAddMemberToTeamMutation();

  const { showToast } = useToast();

  /*****************************************************************
   * 3) Local State
   *****************************************************************/
  // For adding single users to the board
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // For adding entire teams (by enumerating their members)
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  // For setting or removing a single “Board Team” (if your backend supports that)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  /*****************************************************************
   * 4) Handlers - Single Members
   *****************************************************************/
  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      // For each userId, call `addMemberToBoard`
      const addPromises = selectedUserIds.map((userId) =>
        addMemberToBoard({ boardId, userId }).unwrap()
      );
      await Promise.all(addPromises);

      setSelectedUserIds([]);
      showToast('Members added successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to add members:', err);
      showToast(err?.data?.message || 'Error adding members.', 'error');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberFromBoard({ boardId, userId }).unwrap();
      showToast('Member removed successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      showToast(err?.data?.message || 'Error removing member.', 'error');
    }
  };

  const handleCreateUser = async (inputValue: string) => {
    try {
      // Expecting a format: "Name <email>"
      const emailMatch = inputValue.match(/(.+?)\s*<(.+?)>/);
      if (!emailMatch) {
        showToast('Please enter in "Name <email>" format.', 'error');
        return;
      }
      const [_, rawName, rawEmail] = emailMatch;
      const newUser = await createUser({ name: rawName.trim(), email: rawEmail.trim() }).unwrap();
      // Then add them to the board
      await addMemberToBoard({ boardId, userId: newUser._id }).unwrap();
      showToast('User created and added to the board!', 'success');
    } catch (err: any) {
      console.error('Failed to create user:', err);
      showToast(err?.data?.message || 'Error creating user.', 'error');
    }
  };

  /*****************************************************************
   * 5) Handlers - Entire Teams (by enumerating each member)
   *****************************************************************/
  const handleAddTeams = async () => {
    if (selectedTeamIds.length === 0) return;
    try {
      // For each teamId => add all team members individually to the board
      const addPromises = selectedTeamIds.map(async (teamId) => {
        const team = allTeams.find((t) => t._id === teamId);
        if (team && team.members) {
          const memberIds = team.members.map((m) => m.user._id);
          const memberAddPromises = memberIds.map((memberId) =>
            addMemberToBoard({ boardId, userId: memberId }).unwrap()
          );
          await Promise.all(memberAddPromises);
        }
      });

      await Promise.all(addPromises);

      setSelectedTeamIds([]);
      showToast('All members from selected team(s) added successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to add team members:', err);
      showToast(err?.data?.error || 'Error adding teams.', 'error');
    }
  };

  /*****************************************************************
   * 6) Handlers - Single Board <-> Team relationship
   *****************************************************************/
  const handleSetTeam = async (teamId: string) => {
    try {
      await setBoardTeam({ boardId, teamId }).unwrap();
      showToast('Board team set successfully!', 'success');
      refetch(); // Refresh board membership
    } catch (err: any) {
      console.error('Failed to set board team:', err);
      showToast(err?.data?.message || 'Error setting board team.', 'error');
    }
  };

  const handleRemoveTeam = async () => {
    try {
      // Example argument: remove existing members => `clearMembers: true`
      await removeBoardTeam({ boardId, clearMembers: true }).unwrap();
      showToast('Board team removed successfully!', 'success');
      refetch();
    } catch (err: any) {
      console.error('Failed to remove board team:', err);
      showToast(err?.data?.message || 'Error removing board team.', 'error');
    }
  };

  /*****************************************************************
   * 7) MultiSelect Options
   *****************************************************************/
  // Gather all unique user IDs that are part of any team
  const teamMemberIds = allTeams
    .flatMap((team) => team.members.map((member) => member.user._id))
    .filter((id, idx, self) => self.indexOf(id) === idx);

  // Filter all users to those that are actually in some team
  const teamMembers = allUsers.filter((user) => teamMemberIds.includes(user._id));

  // Build options
  const userOptions: OptionType[] = teamMembers.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
    group: 'Users',
  }));

  const teamOptions: OptionType[] = allTeams.map((team) => ({
    value: team._id,
    label: team.name,
    group: 'Teams',
  }));

  const groupedOptions: GroupedOptionType[] = [
    { label: 'Users', options: userOptions },
    { label: 'Teams', options: teamOptions },
  ];

  /*****************************************************************
   * 8) Render/JSX
   *****************************************************************/
  if (isLoading || usersLoading || teamsLoading) {
    return <p className="text-gray-500">Loading board members...</p>;
  }

  if (error || usersError || teamsError) {
    return <p className="text-red-500">Failed to load members or teams.</p>;
  }

  if (!members) {
    return <p>No board members found.</p>;
  }

  return (
    <div className="border p-4 rounded-md bg-white shadow-sm  sidebar">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">Board Members</h2>

      {/************************************************************
       * A) Current Board Members List
       ************************************************************/}
      <div className="mb-6">
        <ul>
          {members.map((user) => (
            <li key={user._id} className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-500 ml-1">({user.email})</span>
              </div>
              <button
                onClick={() => handleRemoveMember(user._id)}
                disabled={isRemovingFromBoard}
                className="text-red-500 hover:text-red-700"
                title="Remove Member"
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/************************************************************
       * B) Add Single Users
       ************************************************************/}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Add Individual Members</h3>
        <MultiSelect
          label="Select or Create Users"
          options={[{ label: 'Users', options: userOptions }]}
          value={selectedUserIds}
          onChange={setSelectedUserIds}
          placeholder="Choose or create users..."
          isDisabled={isAddingToBoard}
          isCreatable={true}
          onCreateOption={handleCreateUser}
        />
        <button
          onClick={handleAddMembers}
          disabled={selectedUserIds.length === 0 || isAddingToBoard}
          className={`mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            selectedUserIds.length === 0 || isAddingToBoard ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAddingToBoard ? 'Adding...' : 'Add Members'}
        </button>
      </div>

      {/************************************************************
       * C) Add Whole Teams (by enumerating each member)
       ************************************************************/}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Add All Members from a Team</h3>
        <MultiSelect
          label="Select Teams"
          options={[{ label: 'Teams', options: teamOptions }]}
          value={selectedTeamIds}
          onChange={setSelectedTeamIds}
          placeholder="Select one or more teams..."
          isDisabled={isAddingToBoard}
        />
        <button
          onClick={handleAddTeams}
          disabled={selectedTeamIds.length === 0 || isAddingToBoard}
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
            selectedTeamIds.length === 0 || isAddingToBoard ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAddingToBoard ? 'Adding...' : 'Add Teams (Members)'}
        </button>
      </div>

      {/************************************************************
       * D) Optional: Set or Remove Board’s Single “Team”
       ************************************************************/}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-medium mb-2">Set or Remove a Single Board Team</h3>

        <div className="flex items-center space-x-2 mb-2">
          <select
            className="border rounded px-2 py-1"
            value={selectedTeamId || ''}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">-- Select a Team --</option>
            {allTeams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => selectedTeamId && handleSetTeam(selectedTeamId)}
            disabled={!selectedTeamId || isSettingBoardTeam}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {isSettingBoardTeam ? 'Setting...' : 'Set Board Team'}
          </button>

          <button
            onClick={handleRemoveTeam}
            disabled={isRemovingBoardTeam}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            {isRemovingBoardTeam ? 'Removing...' : 'Remove Board Team'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          (Only use these if your backend supports a 1:1 “board-to-team” link.)
        </p>
      </div>

      {/************************************************************
       * E) Refresh & Team Management Section
       ************************************************************/}
      <button onClick={() => refetch()} className="mt-4 text-blue-500 hover:underline text-sm">
        Refresh Board Members
      </button>

      {/* If we want to manage a specific team's membership from here: */}
      <div className="mt-8">
        <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-1">
          Manage a Specific Team
        </label>
        <select
          id="team-select"
          value={selectedTeamId || ''}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500
                     sm:text-sm rounded-md"
        >
          <option value="" disabled>
            -- Select a team to manage --
          </option>
          {allTeams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        {selectedTeamId && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Manage Team Members</h3>
            <TeamMembersSection teamId={selectedTeamId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardMembersSection;
