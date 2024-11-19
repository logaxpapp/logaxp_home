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
import CreateEditUserForm from './CreateUserForm';
import ActionMenu from './ActionMenu';
import Pagination from '../common/Pagination/Pagination';

const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users per page

  const { data, error, isLoading, refetch } = useFetchAllUsersQuery({
    page: currentPage,
    limit: usersPerPage,
  });

  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openEditModal = (user: IUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSuspend = async (user: IUser) => {
    try {
      await suspendUser(user._id).unwrap();
      showToast(`${user.name} has been suspended.`, 'success');
      refetch();
    } catch {
      showToast('Failed to suspend user.', 'error');
    }
  };

  const handleReactivate = async (user: IUser) => {
    try {
      await reactivateUser(user._id).unwrap();
      showToast(`${user.name} has been reactivated.`, 'success');
      refetch();
    } catch {
      showToast('Failed to reactivate user.', 'error');
    }
  };

  const handleDelete = (user: IUser) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.users, searchTerm]);

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
            {user.role}
          </span>
        ),
        sortable: true,
      },
      {
        header: 'Actions',
        accessor: (user: IUser) => (
          <ActionMenu
            user={user}
            onEdit={() => openEditModal(user)}
            onSuspend={() => handleSuspend(user)}
            onReactivate={() => handleReactivate(user)}
            onDelete={() => handleDelete(user)}
          />
        ),
      },
    ],
    []
  );

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold text-blue-800 font-primary">Manage Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <DataTable data={filteredUsers} columns={columns} />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil((data?.total || 0) / usersPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User"
        >
          <CreateEditUserForm
            user={selectedUser}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {
              setIsEditModalOpen(false);
              refetch();
            }}
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={async () => {
          if (userToDelete) {
            await deleteUser(userToDelete._id).unwrap();
            showToast(`${userToDelete.name} has been deleted.`, 'success');
            refetch();
            setIsConfirmDeleteOpen(false);
          }
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
      />
    </div>
  );
};

export default UserList;
