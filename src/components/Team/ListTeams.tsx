// src/components/Team/ListTeams.tsx

import React, { useState } from 'react';
import {
  useFetchTeamsQuery,
  useDeleteTeamMutation,
} from '../../api/usersApi';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiUserPlus, FiSearch } from 'react-icons/fi';
import Modal from './Modal';
import EditTeam from './EditTeam';
import AddMemberToTeam from './AddMemberToTeam';
import CreateTeam from './CreateTeam';
import Pagination from './Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { UserRole } from '../../types/enums';
import { Permissions, getPermissions } from '../../utils/permissions';
import { useToast } from '../../features/Toast/ToastContext';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const ListTeams: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { showToast } = useToast();

  // We pull in 'error' from RTK Query
  const { data, error, isLoading, refetch } = useFetchTeamsQuery({
    search,
    role: roleFilter,
    page: currentPage,
    limit,
  });
  const [deleteTeam] = useDeleteTeamMutation();

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  // Default permissions if no user
  const defaultPermissions: Permissions = {
    canCreateTeam: false,
    canEditTeam: false,
    canDeleteTeam: false,
    canAddMember: false,
    canRemoveMember: false,
  };

  // Extract real permissions based on user.role
  const permissions: Permissions = user
    ? getPermissions(user.role as UserRole)
    : defaultPermissions;

  // Handle team delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(id).unwrap();
        refetch();
        showToast('Team deleted successfully!', 'success');
      } catch (err) {
        console.error('Failed to delete team:', err);
        showToast('Failed to delete team.');
      }
    }
  };

  // Edit Modal
  const openEditModal = (team: any) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedTeam(null);
    setIsEditModalOpen(false);
  };

  // Add Member Modal
  const openAddMemberModal = (team: any) => {
    setSelectedTeam(team);
    setIsAddMemberModalOpen(true);
  };
  const closeAddMemberModal = () => {
    setSelectedTeam(null);
    setIsAddMemberModalOpen(false);
  };

  // Create Modal
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  // Search + Filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // reset pagination
  };
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value || undefined);
    setCurrentPage(1);
  };

  // ============ LOADING STATE ============
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-teal-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-teal-600">Loading teams...</span>
      </div>
    );
  }

  // ============ ERROR STATE ============
  if (error) {
    // We'll see if it's a FetchBaseQueryError
    const fetchError = error as FetchBaseQueryError;
    const status = fetchError?.status;

    // If we got a 403 => “Access denied”
    if (status === 403) {
      return (
        <div className="text-red-500 text-center mt-8">
          You do not have permission to view these teams. 
          Please contact an administrator if you believe this is a mistake.
        </div>
      );
    }

    // For other error statuses, we show the fallback
    return (
      <div className="text-red-500 text-center mt-8">
        Failed to load teams. Please try again later.
      </div>
    );
  }

  // ============ SUCCESS STATE ============
  return (
    <div className="bg-gray-50 min-h-screen py-6 text-gray-900">
      {/* Header with Create Button and Search */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Teams</h2>

        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center">
            <label htmlFor="search" className="sr-only">
              Search Teams
            </label>
            <input
              type="text"
              name="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Teams"
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Search Teams"
            >
              <FiSearch />
            </button>
          </form>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            aria-label="Filter by Role"
          >
            <option value="">All Roles</option>
            <option value="Leader">Leader</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>

          {/* Create Team Button */}
          {permissions.canCreateTeam && (
            <button
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Create Team"
            >
              <FiUserPlus className="mr-2" /> Create Team
            </button>
          )}
        </div>
      </div>

      {/* Teams List */}
      {data?.teams?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {data.teams.map((team: any) => (
            <div key={team?._id} className="p-4 bg-gray-100 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <Link
                  to={`/dashboard/teams/${team?._id}`}
                  className="text-2xl font-semibold text-teal-600 hover:underline"
                >
                  {team?.name || 'Unknown Team'}
                </Link>
                <div className="flex space-x-2">
                  {permissions.canEditTeam && (
                    <button
                      onClick={() => openEditModal(team)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      title="Edit Team"
                      aria-label={`Edit ${team?.name || 'Unknown Team'}`}
                    >
                      <FiEdit size={20} />
                    </button>
                  )}
                  {permissions.canAddMember && (
                    <button
                      onClick={() => openAddMemberModal(team)}
                      className="text-green-500 hover:text-green-700 focus:outline-none"
                      title="Add Member"
                      aria-label={`Add Member to ${team?.name || 'Unknown Team'}`}
                    >
                      <FiUserPlus size={20} />
                    </button>
                  )}
                  {permissions.canDeleteTeam && (
                    <button
                      onClick={() => handleDelete(team?._id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      title="Delete Team"
                      aria-label={`Delete ${team?.name || 'Unknown Team'}`}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700">
                {team?.description || 'No description available'}
              </p>
              <div className="mt-4">
                <strong>Members:</strong>
                <ul className="list-disc list-inside">
                  {team?.members?.length ? (
                    team.members.map((member: any) => (
                      <li key={member.user?._id || member.role}>
                        {member.user?.name || 'Unknown Member'} ({member.role})
                      </li>
                    ))
                  ) : (
                    <p>No members in this team.</p>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No teams found. Click "Create Team" to get started.
        </p>
      )}

      {/* Pagination Controls */}
      {data?.pages && data.pages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.pages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Edit Team Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Team">
        {selectedTeam && <EditTeam team={selectedTeam} onClose={closeEditModal} />}
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={closeAddMemberModal}
        title="Add Member to Team"
      >
        {selectedTeam && (
          <AddMemberToTeam teamId={selectedTeam._id} onClose={closeAddMemberModal} />
        )}
      </Modal>

      {/* Create Team Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} title="Create Team">
        <CreateTeam onClose={closeCreateModal} />
      </Modal>
    </div>
  );
};

export default ListTeams;
