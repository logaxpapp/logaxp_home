// src/components/Team/TeamDetail.tsx

import React, { useState } from 'react';
import { useFetchTeamByIdQuery } from '../../api/usersApi';
import { useParams } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { getPermissions, Permissions } from '../../utils/permissions';
import Modal from './Modal';
import RemoveMemberFromTeam from './RemoveMemberFromTeam';
import EditMemberRole from './EditMemberRole';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { UserRole } from '../../types/enums';

interface SelectedMember {
  memberId: string;
  memberName: string;
  memberRole: 'Leader' | 'Member' | 'Viewer';
}

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: team, error, isLoading } = useFetchTeamByIdQuery(id!);

  console.log('Team:', team);

  // State for Modals
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
 // Define default permissions
 const defaultPermissions: Permissions = {
  canCreateTeam: false,
  canEditTeam: false,
  canDeleteTeam: false,
  canAddMember: false,
  canRemoveMember: false,
};

// Explicitly type permissions as Permissions
const permissions: Permissions = user ? getPermissions(user.role as UserRole) : defaultPermissions;

  const openRemoveModal = (member: { _id: string; name: string; role: 'Leader' | 'Member' | 'Viewer' }) => {
    setSelectedMember({
      memberId: member._id,
      memberName: member.name,
      memberRole: member.role,
    });
    setIsRemoveModalOpen(true);
  };

  const openEditRoleModal = (member: { _id: string; name: string; role: 'Leader' | 'Member' | 'Viewer' }) => {
    setSelectedMember({
      memberId: member._id,
      memberName: member.name,
      memberRole: member.role,
    });
    setIsEditRoleModalOpen(true);
  };

  const closeRemoveModal = () => {
    setSelectedMember(null);
    setIsRemoveModalOpen(false);
  };

  const closeEditRoleModal = () => {
    setSelectedMember(null);
    setIsEditRoleModalOpen(false);
  };

  if (isLoading) return <div>Loading team details...</div>;
  if (error) return <div>Error loading team details.</div>;
  if (!team) return <div>Team not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{team.name}</h2>
      <p className="mb-6">{team.description}</p>

      <h3 className="text-xl font-semibold mb-2">Members</h3>
      {team.members && team.members.length > 0 ? (
        <ul className="space-y-2">
        {team.members && team.members.length > 0 ? (
          team.members.map((member: any) => (
            <li key={member.user?._id || member.role} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <span>{member.user?.name || 'Unknown Member'} ({member.role})</span>
              <div className="flex space-x-2">
                {permissions.canEditTeam && (
                  <button
                    onClick={() => openEditRoleModal(member)}
                    className="text-blue-500 hover:text-blue-700"
                    title={`Edit Role for ${member.user?.name || 'Unknown Member'}`}
                    aria-label={`Edit Role for ${member.user?.name || 'Unknown Member'}`}
                  >
                    <FiEdit size={18} />
                  </button>
                )}
                {permissions.canRemoveMember && (
                  <button
                    onClick={() => openRemoveModal(member)}
                    className="text-red-500 hover:text-red-700"
                    title={`Remove ${member.user?.name || 'Unknown Member'} from team`}
                    aria-label={`Remove ${member.user?.name || 'Unknown Member'} from team`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No members in this team.</p>
        )}
      </ul>
      
      ) : (
        <p>No members in this team.</p>
      )}

      {/* Remove Member Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={closeRemoveModal}
        title="Remove Member from Team"
      >
        {selectedMember && (
          <RemoveMemberFromTeam
            teamId={team._id}
            memberId={selectedMember.memberId}
            memberName={selectedMember.memberName}
            memberRole={selectedMember.memberRole}
            onClose={closeRemoveModal}
          />
        )}
      </Modal>

      {/* Edit Member Role Modal */}
      <Modal
        isOpen={isEditRoleModalOpen}
        onClose={closeEditRoleModal}
        title="Edit Member Role"
      >
        {selectedMember && (
          <EditMemberRole
            teamId={team._id}
            memberId={selectedMember.memberId}
            currentRole={selectedMember.memberRole}
            onClose={closeEditRoleModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default TeamDetail;
