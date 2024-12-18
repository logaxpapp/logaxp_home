// src/components/UserList/AdminUser.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  useFetchAllUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useEditUserProfileMutation,
  useDeleteUserMutation,
} from '../../api/usersApi';
import { IUser } from '../../types/user';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import Pagination from '../../components/common/Pagination/Pagination';
import { FaEdit, FaTrash, FaBan, FaPlay, FaFileCsv } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';
import CreateEditUserForm from '../../components/UserList/CreateUserForm';

const AdminUser: React.FC = () => {
  const { data, error, isLoading, refetch } = useFetchAllUsersQuery({ page: 1, limit: 500 });
  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [editUserProfile] = useEditUserProfileMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { showToast } = useToast();

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  // Debounce Search Term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Sorting and pagination state
  const [sortColumn, setSortColumn] = useState<keyof IUser | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of users displayed per page

  // Define columns for DataTable
  const columns: Column<IUser>[] = useMemo(() => [
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
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              openEditModal(user);
            }}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            title="Edit User"
          >
            <FaEdit className="text-gray-500 hover:text-gray-700" />
          </button>
          {user.status !== 'Suspended' ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                handleSuspend(user);
              }}
              className="p-2 rounded-full hover:bg-yellow-200 focus:outline-none"
              title="Suspend User"
            >
              <FaBan className="text-yellow-600 hover:text-yellow-800" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                handleReactivate(user);
              }}
              className="p-2 rounded-full hover:bg-green-200 focus:outline-none"
              title="Reactivate User"
            >
              <FaPlay className="text-green-600 hover:text-green-800" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleDelete(user);
            }}
            className="p-2 rounded-full hover:bg-red-200 focus:outline-none"
            title="Delete User"
          >
            <FaTrash className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      ),
      sortable: false,
    },
  ], []);

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
      showToast(err?.data?.message || 'Failed to suspend user.', 'error');
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
      showToast(err?.data?.message || 'Failed to reactivate user.', 'error');
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
        showToast(err?.data?.message || 'Failed to delete user.', 'error');
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

  // Filtered Data: Only Admin Users and Search Term
  const filteredData = useMemo(() => {
    if (!data?.users) return [];

    return data.users.filter((user) => 
      user.role === 'admin' &&
      (user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [data, debouncedSearchTerm]);

  // Sorted Data
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

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Function to export selected users as CSV
  const exportSelectedUsers = () => {
    if (selectedRowIds.size === 0) {
      showToast('No users selected for export.', 'error');
      return;
    }

    const headers = ['Name', 'Email', 'Role', 'Status'];
    const rows = Array.from(selectedRowIds).map(userId => {
      const user = data?.users.find(user => user._id === userId);
      if (!user) return ['-', '-', '-', '-'];
      return [
        user.name,
        user.email,
        user.role.charAt(0).toUpperCase() + user.role.slice(1),
        user.status,
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

  if (isLoading) {
    return <div className="text-center mt-10">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error fetching users.</div>;
  }

  return (
    <div className="bg-blue-50 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h1 className="text-xl font-semibold text-blue-800 font-primary">Admin Users</h1>
        <div className="flex space-x-4 font-secondary">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2"
          />
          {/* Create User Button */}
          <Button variant="primary" onClick={() => openEditModal(null)}>
            + Create User
          </Button>
          {/* Export Selected Users Button */}
          <Button variant="edit" onClick={exportSelectedUsers}>
          <FaFileCsv className="mr-2 text-white" size={20} />
            Export Selected
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable<IUser>
        data={paginatedData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectable
        selectedRowIds={selectedRowIds}
        onRowSelect={setSelectedRowIds}
        onRowClick={(user) => openEditModal(user)}
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
            showToast(selectedUser ? 'User updated successfully.' : 'User created successfully.', 'success');
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
