// src/components/EditUserProfileForm/EditUserProfileForm.tsx

import React, { useState } from 'react';
import { useEditUserProfileMutation } from '../../api/apiSlice';

interface EditUserProfileFormProps {
  userId: string;
  currentName: string;
  currentDepartment: string;
  currentPhoneNumber: string;
}

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  currentName,
  currentDepartment,
  currentPhoneNumber,
}) => {
  const [editUserProfile, { isLoading, error }] = useEditUserProfileMutation();

  const [formData, setFormData] = useState({
    name: currentName,
    department: currentDepartment,
    phone_number: currentPhoneNumber,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editUserProfile({ userId, updates: formData }).unwrap();
      // Optionally, show a success message or perform additional actions
    } catch (err) {
      console.error('Failed to edit user profile:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl mb-4">Edit User Profile</h2>
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
        <label className="block text-gray-700">Department:</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
      >
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>
      {error && <div className="text-red-500 mt-2">Error updating profile.</div>}
    </form>
  );
};

export default EditUserProfileForm;
