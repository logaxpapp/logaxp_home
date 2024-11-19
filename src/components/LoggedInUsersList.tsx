import React, { useState } from 'react';
import { useGetAllLoggedInUsersQuery, useSuspendUserMutation, useReactivateUserMutation, useLogoutMutation } from '../api/usersApi';
import Pagination from '../components/common/Pagination/Pagination';
import DataTable, { Column } from '../components/common/DataTable/DataTable';
import Button from '../components/common/Button/Button';
import { IUser } from '../types/user';

const LoggedInUsersList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [dateFilter, setDateFilter] = useState<{ start?: string; end?: string }>({});
  const { data, error, isLoading } = useGetAllLoggedInUsersQuery({ page, limit, ...dateFilter });

  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [logoutUser] = useLogoutMutation();

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

  const handleSuspendUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await suspendUser(userId).unwrap();
        alert('User suspended successfully.');
      } catch (error) {
        alert('Failed to suspend user.');
      }
    }
  };

  const handleReactivateUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        await reactivateUser(userId).unwrap();
        alert('User reactivated successfully.');
      } catch (error) {
        alert('Failed to reactivate user.');
      }
    }
  };

  const handleLogoutUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to log this user out?')) {
      try {
        await logoutUser().unwrap();  // userId parameter is not needed here
        alert('User logged out successfully.');
      } catch (error) {
        alert('Failed to log out user.');
      }
    }
  };

  const columns: Column<IUser>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Last Accessed', 
      accessor: (user) => user.lastAccessed ? new Date(user.lastAccessed).toLocaleString() : 'N/A' 
    },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: (user) => (
        <div className="flex space-x-2">
                      {user.status !== 'Suspended' ? (
              <Button
                variant="danger"
                size="small"
                onClick={() => handleSuspendUser(user._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300"
              >
                Suspend
              </Button>
            ) : (
              <Button
                variant="success"
                size="small"
                onClick={() => handleReactivateUser(user._id)}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-300"
              >
                Reactivate
              </Button>
            )}

          <Button
            variant="info"
            size="small"
            onClick={() => handleLogoutUser(user._id)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Logout
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading logged-in users...</p>;
  if (error) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold  text-blue-700 font-primary">
        Logged-in Users
      </h2>
      </div>

      <div className="mb-4 flex justify-between items-center " style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      
    }}>
        <select
          className="border p-2 rounded"
          onChange={handleDateFilter}
          defaultValue=""
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="lastWeek">Last Week</option>
        </select>
      </div>

      {data?.users?.length ? (
        <>
          <DataTable
            data={data.users}
            columns={columns}
          />
          <Pagination
            currentPage={data.currentPage ?? 1}
            totalPages={data.totalPages ?? 1}
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />
        </>
      ) : (
        <p>No logged-in users found.</p>
      )}
    </div>
  );
};

export default LoggedInUsersList;
