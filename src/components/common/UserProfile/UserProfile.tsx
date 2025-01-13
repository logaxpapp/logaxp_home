import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { clearUser, setName, setEmail } from '../../../store/slices/userSlice';
import { useFetchAllUsersQuery } from '../../../api/usersApi';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // Fetch all users with RTK Query
  const { data, error, isLoading } = useFetchAllUsersQuery({ page: 1, limit: 500 });

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      dispatch(setName(e.target.value));
    }
  };

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      dispatch(setEmail(e.target.value));
    }
  };

  const resetUser = () => {
    dispatch(clearUser());
  };

  if (!user) {
    return <div className="p-4 bg-white rounded shadow">No user selected.</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">User Profile</h2>
      <div className="mb-2">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          value={user.name || ''}
          onChange={updateName}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          value={user.email || ''}
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
       
        {data && (
          <ul>
            {data.users.map((u) => (
              <li key={u._id}>
                {u.name} - {u.email} - {u.role}
              </li>
            ))}
          </ul>
        )}
        {data && <p>Total Users: {data.total}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
