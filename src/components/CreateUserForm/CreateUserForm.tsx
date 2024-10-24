// src/components/CreateUserForm/CreateUserForm.tsx

import React, { useState } from 'react';
import { useCreateUserMutation } from '../../api/apiSlice';
import { useNavigate } from 'react-router-dom';

const CreateUserForm: React.FC = () => {
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData).unwrap();
      // Redirect to the user list or show a success message
      navigate('/users');
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl mb-4">Create New User</h2>
      <div className="mb-2">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Support">Support</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div className="text-red-500 mt-2">Error creating user.</div>}
    </form>
  );
};

export default CreateUserForm;
