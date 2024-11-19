import React, { useState, useMemo, Fragment } from 'react';
import {
  useFetchAllUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useEditUserProfileMutation,
  useDeleteUserMutation,
} from '../../api/usersApi';
import { IUser } from '../../types/user';
import DataTable from '../../components/common/DataTable/DataTable';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import Pagination from '../../components/common/Pagination/Pagination';
import { Menu, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';
import CreateEditUserForm from '../../components/UserList/CreateUserForm';

const AdminUser: React.FC = () => {
  
  const { data, error, isLoading, refetch } = useFetchAllUsersQuery({page: 1, limit: 500 });
  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [editUserProfile] = useEditUserProfileMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { showToast } = useToast();

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  // Sorting and pagination state
  const [sortColumn, setSortColumn] = useState<keyof IUser | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of users displayed per page

  // Define columns for DataTable
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
              user.role === 'admin'
                ? 'bg-red-100 text-red-800'
                : user.role === 'support'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {user.role}
          </span>
        ),
        sortable: true,
      },
      {
        header: 'Status',
        accessor: (user: IUser) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : user.status === 'Suspended'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.status}
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
        sortable: false,
      },
    ],
    []
  );

  // Action Menu Component
  interface ActionMenuProps {
    user: IUser;
    onEdit: () => void;
    onSuspend: () => void;
    onReactivate: () => void;
    onDelete: () => void;
  }

  const ActionMenu: React.FC<ActionMenuProps> = ({ user, onEdit, onSuspend, onReactivate, onDelete }) => {
    return (
      <Menu as="div" className="relative inline-block text-left overflow-auto">
        <Menu.Button className="inline-flex justify-center p-1 rounded-full hover:bg-gray-200">
          <FaEllipsisV className="text-gray-500 hover:text-gray-700" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-600' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  onClick={onEdit}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              )}
            </Menu.Item>
            {user.status !== 'Suspended' ? (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-600' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-yellow-600`}
                    onClick={onSuspend}
                  >
                    Suspend
                  </button>
                )}
              </Menu.Item>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-600' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-green-600`}
                    onClick={onReactivate}
                  >
                    Reactivate
                  </button>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-600' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                  onClick={onDelete}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  // Open Edit/Create Modal
  const openEditModal = (user: IUser | null) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Close Edit/Create Modal
  const closeEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  // Handle Suspend User
  const handleSuspend = async (user: IUser) => {
    try {
      await suspendUser(user._id).unwrap();
      showToast(`${user.name} has been suspended.`, 'success');
      refetch();
    } catch (err: any) {
      console.error('Failed to suspend user:', err);
      showToast('Failed to suspend user.', 'error');
    }
  };

  // Handle Reactivate User
  const handleReactivate = async (user: IUser) => {
    try {
      await reactivateUser(user._id).unwrap();
      showToast(`${user.name} has been reactivated.`, 'success');
      refetch();
    } catch (err: any) {
      console.error('Failed to reactivate user:', err);
      showToast('Failed to reactivate user.', 'error');
    }
  };

  // Handle Delete User
  const handleDelete = (user: IUser) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  // Confirm Delete User
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id).unwrap();
        showToast(`${userToDelete.name} has been deleted.`, 'success');
        setIsConfirmDeleteOpen(false);
        setUserToDelete(null);
        refetch();
      } catch (err: any) {
        console.error('Failed to delete user:', err);
        showToast('Failed to delete user.', 'error');
      }
    }
  };

  // Sorting logic
  const handleSort = (column: keyof IUser) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    // Filter to show only users with the role 'admin'
    return data?.users.filter((user) => user.role === 'admin') || [];
  }, [data]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-center mt-10">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error fetching users.</div>;
  }

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h1 className="text-2xl font-semibold text-blue-800 font-primary">Admin User</h1>
        <Button variant="primary" onClick={() => openEditModal(null)}>
          + Create User
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={paginatedData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit/Create User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={selectedUser ? 'Edit User' : 'Create New User'}
      >
        <CreateEditUserForm
          user={selectedUser}
          onClose={closeEditModal}
          onSuccess={() => {
            closeEditModal();
            refetch();
          }}
        />
      </Modal>

      {/* Confirm Delete Modal */}
      {userToDelete && (
        <ConfirmModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default AdminUser;
