// src/components/EditUserProfileForm.tsx

import React, { useState } from 'react';
import { useEditUserProfileMutation } from '../api/usersApi';
import { useToast } from '../features/Toast/ToastContext';

interface EditUserProfileFormProps {
  userId: string;
  currentName: string;
  currentDepartment: string;
  currentPhoneNumber: string;
  currentDateOfBirth?: string; // ISO string
}

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  currentName,
  currentDepartment,
  currentPhoneNumber,
  currentDateOfBirth,
}) => {
  const [name, setName] = useState(currentName);
  const [department, setDepartment] = useState(currentDepartment);
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState(currentDateOfBirth || '');
  const [editUserProfile, { isLoading }] = useEditUserProfileMutation();

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    dateOfBirth?: string;
  }>({});

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let errors: { name?: string; dateOfBirth?: string } = {};

    // Basic Validation
    if (!name.trim()) {
      errors.name = 'Name is required.';
    }

    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        errors.dateOfBirth = 'Invalid date of birth.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({}); // Clear previous errors

    try {
      // Prepare updates object
      const updates: Partial<{
        name: string;
        department: string;
        phone_number: string;
        date_of_birth: string;
      }> = { name, department, phone_number: phoneNumber };

      if (dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        updates.date_of_birth = parsedDate.toISOString();
      }

      await editUserProfile({ userId, updates }).unwrap();
      showToast('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to edit user profile:', err);
      showToast(err?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded px-8 py-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Edit User Profile</h2>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            placeholder="Enter your name"
            required
          />
          {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
        </div>

        {/* Department Field */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter your department"
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="e.g., 123-456-7890"
          />
        </div>

        {/* Date of Birth Field */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border ${
              formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
          />
          {formErrors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{formErrors.dateOfBirth}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfileForm;
