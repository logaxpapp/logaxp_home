// src/components/UserList/UserList.tsx

import React, { useState, useMemo } from 'react';
import {
  useFetchAllUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useDeleteUserMutation,
} from '../../api/usersApi';
import { IUser } from '../../types/user';
import DataTable from '../common/DataTable/DataTable';
import Modal from '../common/Feedback/Modal';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import { useToast } from '../../features/Toast/ToastContext';
import CreateUserForm from './CreateUserForm';
import ActionMenu from './ActionMenu';
import Pagination from '../common/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button/Button';

const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10; // Number of users per page
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { data, error, isLoading, refetch } = useFetchAllUsersQuery({
    page: currentPage,
    limit: usersPerPage,
  });

  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleSuspend = async (user: IUser) => {
    try {
      await suspendUser(user._id).unwrap();
      showToast(`${user.name} has been suspended.`, 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to suspend user.', 'error');
    }
  };

  const handleReactivate = async (user: IUser) => {
    try {
      await reactivateUser(user._id).unwrap();
      showToast(`${user.name} has been reactivated.`, 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to reactivate user.', 'error');
    }
  };

  const handleDelete = (user: IUser) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const openEditPage = (user: IUser) => {
    if (!user._id) {
      console.error('User ID is undefined');
      return;
    }
    navigate(`/dashboard/users/edit/${user._id}`);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name' as keyof IUser,
        sortable: true,
      },
      {
        header: 'Email',
        accessor: 'email' as keyof IUser,
        sortable: true,
      },
      {
        header: 'Role',
        accessor: (user: IUser) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        ),
        sortable: true,
      },
      {
        header: 'Actions',
        accessor: (user: IUser) => (
          <ActionMenu
            user={user}
            onEdit={() => openEditPage(user)}
            onSuspend={() => handleSuspend(user)}
            onReactivate={() => handleReactivate(user)}
            onDelete={() => handleDelete(user)}
          />
        ),
      },
    ],
    [openEditPage, handleSuspend, handleReactivate, handleDelete]
  );

  const filteredUsers = useMemo<IUser[]>(() => {
    if (!data?.users) return [];
    return data.users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.users, searchTerm]);

  // Function to export selected users as CSV
  const exportSelectedUsers = () => {
    if (selectedRowIds.size === 0) {
      showToast('No users selected for export.', 'error');
      return;
    }

    const headers = ['Name', 'Email', 'Role'];
    const rows = Array.from(selectedRowIds).map(userId => {
      const user = data?.users.find(user => user._id === userId);
      if (!user) return ['-', '-', '-'];
      return [
        user.name,
        user.email,
        user.role.charAt(0).toUpperCase() + user.role.slice(1),
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_users_export.csv');
    link.click();
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600 dark:text-gray-300">
        Loading users...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-red-600">Error loading users</div>
    </div>
  );

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold text-blue-800 font-primary">Manage Users</h2>
        <div className="flex space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2"
          />
          {/* Create User Button */}
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            Create User
          </Button>
          {/* Export Selected Users Button */}
          <Button variant="secondary" onClick={exportSelectedUsers}>
            Export Selected
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        selectable
        selectedRowIds={selectedRowIds}
        onRowSelect={setSelectedRowIds}
        onRowClick={openEditPage}
        sortColumn={undefined} // You can implement sorting state if needed
        sortDirection={undefined}
        onSort={undefined}
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil((data?.total || 0) / usersPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create User"
        >
          <CreateUserForm
            user={selectedUser}
            onClose={() => setIsCreateModalOpen(false)} // Fixed the onClose handler
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refetch();
              showToast('User created successfully.', 'success');
            }}
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && userToDelete && (
        <ConfirmModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={async () => {
            try {
              await deleteUser(userToDelete._id).unwrap();
              showToast(`${userToDelete.name} has been deleted.`, 'success');
              refetch();
              setIsConfirmDeleteOpen(false);
              // Optionally remove from selected rows
              setSelectedRowIds(prev => {
                const newSelected = new Set(prev);
                newSelected.delete(userToDelete._id);
                return newSelected;
              });
            } catch {
              showToast('Failed to delete user.', 'error');
            }
          }}
          title="Confirm Delete"
          message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default UserList;
