// src/components/UserList/CreateEditUserForm.tsx

import React, { useState } from 'react';
import { useCreateUserMutation, useAdminEditUserProfileMutation } from '../../api/usersApi';
import { IUser } from '../../types/user';
import Button from '../common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';
import MultiSelect from '../common/Input/SelectDropdown/MultiSelect';
import { Application } from '../../types/enums';

// Define options for applications managed
const applicationOptions = Object.values(Application).map((app) => ({
  value: app,
  label: app,
}));

interface CreateEditUserFormProps {
  user: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEditUserForm: React.FC<CreateEditUserFormProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    role: user ? user.role : 'User',
    password: user ? '' : '', // Only needed for new users
    applications_managed: user
      ? user.applications_managed.map((app) => app.toString()) || []
      : [], // Convert Application enums to strings
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [editUserProfile, { isLoading: isEditing }] = useAdminEditUserProfileMutation();
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplicationsManagedChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      applications_managed: selectedValues, // Keep as string[]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        applications_managed: formData.applications_managed.map(
          (app) => app as Application // Convert back to Application enum
        ),
      };

      if (user) {
        // If user exists, perform update
        await editUserProfile({ userId: user._id, updates: payload }).unwrap();
        showToast('User profile updated successfully.', 'success');
      } else {
        // If no user exists, create a new user
        await createUser(payload).unwrap();
        showToast('User created successfully.', 'success');
      }
      onSuccess();
    } catch (err: any) {
      console.error('Failed to save user:', err);
      showToast(err.data?.message || 'Failed to save user.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Role Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="support">Support</option>
        </select>
      </div>

      {/* Password Field (only show for new users) */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      )}

      {/* Applications Managed Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Applications Managed
        </label>
        <MultiSelect
          options={applicationOptions}
          value={formData.applications_managed} // Pass string[]
          onChange={handleApplicationsManagedChange}
          placeholder="Select Applications"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isCreating || isEditing}>
          {isCreating || isEditing ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default CreateEditUserForm;
