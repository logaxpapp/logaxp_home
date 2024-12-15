// src/components/UserList/LoggedInUsersList.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  useGetAllLoggedInUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useAdminLogoutUserMutation, // Correctly imported
} from '../api/usersApi';
import { IUser } from '../types/user';
import DataTable, { Column } from '../components/common/DataTable/DataTable';
import Button from '../components/common/Button/Button';
import Pagination from '../components/common/Pagination/Pagination';
import { FaFileCsv, FaBan, FaPlay, FaSignOutAlt } from 'react-icons/fa'; // Imported FaFileCsv
import ConfirmModal from '../components/common/Feedback/ConfirmModal';
import { useToast } from '../features/Toast/ToastContext';

const LoggedInUsersList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [dateFilter, setDateFilter] = useState<{ start?: string; end?: string }>({});
  const { data, error, isLoading, refetch } = useGetAllLoggedInUsersQuery({ page, limit, ...dateFilter });

  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [adminLogoutUser] = useAdminLogoutUserMutation(); // Correctly initialized
  const { showToast } = useToast();

  // State for selection
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [userToLogout, setUserToLogout] = useState<IUser | null>(null);

  // Sorting and pagination state
  const [sortColumn, setSortColumn] = useState<keyof IUser | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of users displayed per page

  // Define handleDateFilter function
  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'today') {
      const today = new Date().toISOString().split('T')[0];
      setDateFilter({ start: today, end: today });
    } else if (value === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().split('T')[0];
      setDateFilter({ start: date, end: date });
    } else if (value === 'lastWeek') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const date = lastWeek.toISOString().split('T')[0];
      setDateFilter({ start: date });
    } else {
      setDateFilter({});
    }
  };

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
      header: 'Last Accessed',
      accessor: (user: IUser) =>
        user.lastAccessed ? new Date(user.lastAccessed).toLocaleString() : 'N/A',
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
          {/* Suspend or Reactivate Button */}
          {user.status !== 'Suspended' ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                handleSuspendUser(user);
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
                handleReactivateUser(user);
              }}
              className="p-2 rounded-full hover:bg-green-200 focus:outline-none"
              title="Reactivate User"
            >
              <FaPlay className="text-green-600 hover:text-green-800" />
            </button>
          )}
          {/* Logout Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleLogoutUser(user);
            }}
            className="p-2 rounded-full hover:bg-blue-200 focus:outline-none"
            title="Logout User"
          >
            <FaSignOutAlt className="text-blue-600 hover:text-blue-800" />
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
  const handleSuspendUser = async (user: IUser) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await suspendUser(user._id).unwrap();
        showToast(`${user.name} has been suspended.`, 'success');
        refetch();
      } catch (error: any) {
        console.error('Failed to suspend user:', error);
        showToast(error?.data?.message || 'Failed to suspend user.', 'error');
      }
    }
  };

  // Handle Reactivate User
  const handleReactivateUser = async (user: IUser) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        await reactivateUser(user._id).unwrap();
        showToast(`${user.name} has been reactivated.`, 'success');
        refetch();
      } catch (error: any) {
        console.error('Failed to reactivate user:', error);
        showToast(error?.data?.message || 'Failed to reactivate user.', 'error');
      }
    }
  };

  // Handle Logout User (Admin Logout)
  const handleLogoutUser = (user: IUser) => {
    setUserToLogout(user);
    setIsConfirmLogoutOpen(true);
  };

  // Confirm Logout User (Admin Logout)
  const confirmLogoutUser = () => {
    if (userToLogout) {
      adminLogoutUser(userToLogout._id)
        .unwrap()
        .then(() => {
          showToast(`${userToLogout.name} has been logged out.`, 'success');
          setIsConfirmLogoutOpen(false);
          setUserToLogout(null);
          refetch();
        })
        .catch((error: any) => {
          console.error('Failed to logout user:', error);
          showToast(error?.data?.message || 'Failed to logout user.', 'error');
        });
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

  // Filtered Data: Only Logged-in Users and Search Term
  const filteredData = useMemo(() => {
    if (!data?.users) return [];

    return data.users.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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

      // Handle date sorting for 'lastAccessed'
      if (sortColumn === 'lastAccessed') {
        const aDate = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0;
        const bDate = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
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

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / itemsPerPage);
  }, [sortedData, itemsPerPage]);

  // Function to export selected users as CSV
  const exportSelectedUsers = () => {
    if (selectedRowIds.size === 0) {
      showToast('No users selected for export.', 'error');
      return;
    }

    const headers = ['Name', 'Email', 'Role', 'Last Accessed', 'Status'];
    const rows = Array.from(selectedRowIds).map(userId => {
      const user = data?.users.find(user => user._id === userId);
      if (!user) return ['-', '-', '-', '-', '-'];
      return [
        user.name,
        user.email,
        user.role.charAt(0).toUpperCase() + user.role.slice(1),
        user.lastAccessed ? new Date(user.lastAccessed).toLocaleString() : 'N/A',
        user.status,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_logged_in_users_export.csv');
    link.click();
  };

  if (isLoading) return <p>Loading logged-in users...</p>;
  if (error) return <p className="text-red-500">Failed to load users.</p>;
  if (data?.users.length === 0) return <p>No users are currently logged in.</p>;

  return (
    <div className="p-4 bg-blue-50">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Logged-in Users</h2>
        <div className="flex space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2"
          />
          {/* Date Filter */}
          <select
            className="border p-2 rounded text-sm"
            onChange={handleDateFilter}
            defaultValue=""
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="lastWeek">Last Week</option>
          </select>
          {/* Export Selected Users Button with Icon */}
          <Button
            variant="primary"
            onClick={exportSelectedUsers}
            aria-label="Export Selected Users"
          >
            <FaFileCsv className="inline-block mr-2 text-blue-600" size={20} />
            Export Selected
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-x-auto">
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
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Confirm Logout Modal */}
      {userToLogout && (
        <ConfirmModal
          isOpen={isConfirmLogoutOpen}
          onClose={() => setIsConfirmLogoutOpen(false)}
          onConfirm={confirmLogoutUser}
          title="Confirm Logout"
          message={`Are you sure you want to log out ${userToLogout?.name}?`}
        />
      )}
    </div>
  );
};

export default LoggedInUsersList;
