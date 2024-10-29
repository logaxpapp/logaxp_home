// src/components/common/UserProfile/UserProfile.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { clearUser, setName, setEmail } from '../../../store/slices/userSlice';
import { useFetchAllUsersQuery } from '../../../api/apiSlice';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  // Example usage of RTK Query to fetch all users
  const { data, error, isLoading } = useFetchAllUsersQuery();

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value));
  };

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  };

  const resetUser = () => {
    dispatch(clearUser());
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">User Profile</h2>
      <div className="mb-2">
        <label className="block text-gray-700">Name:</label>
        <input
          title={'Name'}
          placeholder='Enter your name'
          type="text"
          value={user.name}
          onChange={updateName}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Email:</label>
        <input
          title={'Email'}
          placeholder='Enter your email'
          type="email"
          value={user.email}
          onChange={updateEmail}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        onClick={resetUser}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Reset
      </button>

      {/* Example Display of Fetched Users */}
      <div className="mt-8">
        <h3 className="text-lg mb-2">All Users</h3>
        {isLoading && <div>Loading users...</div>}
        {error && <div>Error fetching users.</div>}
        {data && (
          <ul>
            {data.users.map((user) => (
              <li key={user._id}>{user.name} - {user.email} - {user.role}</li>
            ))}
          </ul>
        )}
        {data && <p>Total Users: {data.total}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
