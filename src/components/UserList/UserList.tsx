// src/components/UserList/UserList.tsx

import React from 'react';
import { useFetchAllUsersQuery } from '../../api/apiSlice';

const UserList: React.FC = () => {
  const { data, error, isLoading } = useFetchAllUsersQuery();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">All Users</h1>
      <ul>
        {data?.users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
      <p>Total Users: {data?.total}</p>
    </div>
  );
};

export default UserList;
