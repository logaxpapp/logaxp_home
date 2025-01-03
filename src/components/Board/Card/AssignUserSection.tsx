import React, { useState } from 'react';
import { useAssignUserToCardMutation } from '../../../api/tasksApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { FiUserPlus } from 'react-icons/fi';
import { useFetchAllUsersQuery } from '../../../api/usersApi';
import { IUser } from '../../../types/user';
import SingleSelect, { OptionType } from '../../../components/common/Input/SelectDropdown/SingleSelect';

interface AssignUserSectionProps {
  cardId: string;
  currentAssignees: { _id: string; name: string; email: string }[];
}

const AssignUserSection: React.FC<AssignUserSectionProps> = ({
  cardId,
  currentAssignees,
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [assignUserToCard, { isLoading }] = useAssignUserToCardMutation();
  const { showToast } = useToast();

  const { data, error, isLoading: isFetchingUsers } = useFetchAllUsersQuery({ page: 1, limit: 1000 });

  // Map current assignees to include full user details or fallback to "Unknown User"
  const enrichedAssignees = currentAssignees.map((assignee) => {
    const matchedUser = data?.users.find((user: IUser) => user._id === assignee._id);
    return matchedUser || { ...assignee, name: 'Unknown User', email: 'N/A' };
  });

  const currentAssigneeIds = enrichedAssignees.map((assignee) => assignee._id);
  const availableUsers = data?.users.filter((user) => !currentAssigneeIds.includes(user._id)) || [];

  // Convert users to options for SingleSelect
  const userOptions: OptionType[] = availableUsers.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
  }));

  const handleAssign = async () => {
    if (!selectedUser) {
      showToast('Please select a user.', 'error');
      return;
    }

    try {
      await assignUserToCard({ cardId, userId: selectedUser }).unwrap();
      showToast('User assigned successfully!', 'success');
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Failed to assign user:', err);
      showToast(err?.data?.message || 'Error assigning user.', 'error');
    }
  };

  if (isFetchingUsers) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error loading users.</p>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4">
        <FiUserPlus className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Assign User</h3>
      </div>

      {/* Current Assignees Section */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Current Assignees</h4>
        <p className="text-sm text-gray-600">
          {enrichedAssignees.length > 0
            ? enrichedAssignees.map((user) => (
                <span key={user._id} className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-md mr-2">
                  {user.name} ({user.email})
                </span>
              ))
            : 'No assignees yet.'}
        </p>
      </div>

      {/* Select User Section */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Add User to Card</h4>
        <SingleSelect
          label="Select User"
          options={userOptions}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Select a user..."
          isDisabled={isLoading}
          isLoading={isFetchingUsers}
        />

        <button
          onClick={handleAssign}
          disabled={isLoading || !selectedUser}
          className={`w-full px-3 py-2 text-white rounded-md shadow-md flex items-center justify-center gap-2 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Assigning...' : <><FiUserPlus /><span>Assign</span></>}
        </button>
      </div>
    </div>
  );
};

export default AssignUserSection;
