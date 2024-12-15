// src/components/UserList/EditUserForm.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchAllUsersQuery,
  useAdminEditUserProfileMutation,
} from '../../api/usersApi';
import { IUser, OnboardingStep } from '../../types/user';
import Button from '../common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';
import MultiSelect from '../common/Input/SelectDropdown/MultiSelect';
import { Application } from '../../types/enums';
import { FaUserEdit, FaAddressBook, FaBriefcase, FaTasks } from 'react-icons/fa';

interface SelectOption {
  value: string;
  label: string;
}

// Options for Applications Managed
const applicationOptions: SelectOption[] = Object.values(Application).map((app) => ({
  value: app,
  label: app.replace(/([A-Z])/g, ' $1').trim(),
}));

// Options for Onboarding Steps using the OnboardingStep enum
const onboardingStepOptions: SelectOption[] = Object.values(OnboardingStep).map((step) => ({
  value: step,
  label: step.replace(/([A-Z])/g, ' $1').trim(), // e.g., "WelcomeEmail" becomes "Welcome Email"
}));

const EditUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch all users to populate the Manager dropdown
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useFetchAllUsersQuery({ page: 1, limit: 100 });

  const [editUserProfile, { isLoading: isEditing }] =
    useAdminEditUserProfileMutation();

  const [formData, setFormData] = useState<Partial<IUser> | null>(null);

  // Populate formData when user data is loaded
  useEffect(() => {
    if (usersData?.users) {
      const userToEdit = usersData.users.find((u) => u._id === id);
      if (userToEdit) {
        setFormData({
          ...userToEdit,
          applications_managed: userToEdit.applications_managed || [],
          onboarding_steps_completed: userToEdit.onboarding_steps_completed || [],
          address:
            userToEdit.address || {
              street: '',
              city: '',
              state: '',
              zip: '',
              country: '',
            },
          manager: userToEdit.manager || '', // Ensure manager is initialized
        });
      }
    }
  }, [usersData, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev!,
        address: {
          ...prev!.address!,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: new Date(value).toISOString(), // Store as ISO string
    }));
  };

  const handleApplicationsManagedChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev!,
      applications_managed: selectedValues as Application[],
    }));
  };

  const handleOnboardingStepsChange = (steps: string[]) => {
    setFormData((prev) => ({
      ...prev!,
      onboarding_steps_completed: steps as OnboardingStep[],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await editUserProfile({ userId: id!, updates: formData }).unwrap();
        showToast('User profile updated successfully.', 'success');
        navigate(-1);
      } catch (err: any) {
        showToast(err?.data?.message || 'Failed to update user.', 'error');
      }
    }
  };

  if (isUsersLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading user details...
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Failed to load user data.</div>
      </div>
    );
  }

  // Filter managers for the Manager dropdown (assuming managers have job_title 'Manager')
  const managers = usersData?.users.filter((u) => u.job_title === 'Manager') || [];

  // Options for Managers
  const managerOptions: SelectOption[] = managers.map((manager) => ({
    value: manager._id,
    label: manager.name,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 w-full">
        <div className="flex items-center mb-8 bg-blue-50 p-4 rounded-lg">
          <FaUserEdit className="text-blue-500 text-4xl mr-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Edit User
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Personal Information Section */}
          <section className="space-y-6">
            <div className="flex items-center">
              <FaAddressBook className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Personal Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  name="department"
                  type="text"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engineering"
                />
              </div>

              {/* Manager */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manager
                </label>
                <select
                  name="manager"
                  value={
                    typeof formData.manager === 'string'
                      ? formData.manager
                      : formData.manager?._id || ''
                  }
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managerOptions.map((manager) => (
                    <option key={manager.value} value={manager.value}>
                      {manager.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  value={
                    formData.date_of_birth
                      ? new Date(formData.date_of_birth).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleDateChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Work Information Section */}
          <section className="space-y-6">
            <div className="flex items-center">
              <FaBriefcase className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Work Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Title */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </label>
                <input
                  name="job_title"
                  type="text"
                  value={formData.job_title || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer"
                />
              </div>

              {/* Employment Type */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employment Type
                </label>
                <input
                  name="employment_type"
                  type="text"
                  value={formData.employment_type || ''}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full-Time"
                />
              </div>

              {/* Hourly Rate */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hourly Rate ($)
                </label>
                <input
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev!,
                      hourlyRate: value === '' ? undefined : parseFloat(value),
                    }));
                  }}
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          {/* Applications Managed Section */}
          <section className="space-y-6">
            <div className="flex items-center">
              <FaTasks className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Applications Managed
              </h3>
            </div>
            <div>
              <MultiSelect
                options={applicationOptions}
                value={formData.applications_managed || []}
                onChange={handleApplicationsManagedChange}
                placeholder="Select Applications"
              />
            </div>
          </section>

          {/* Onboarding Steps Section */}
          <section className="space-y-6">
            <div className="flex items-center">
              <FaTasks className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Onboarding Steps
              </h3>
            </div>
            <div>
              <MultiSelect
                options={onboardingStepOptions}
                value={formData.onboarding_steps_completed || []}
                onChange={handleOnboardingStepsChange}
                placeholder="Select Completed Steps"
              />
            </div>
          </section>

          {/* Address Section */}
          <section className="space-y-6">
            <div className="flex items-center">
              <FaAddressBook className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Address
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street
                </label>
                <input
                  name="address.street"
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  name="address.city"
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={handleChange}
                  placeholder="New York"
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State
                </label>
                <input
                  name="address.state"
                  type="text"
                  value={formData.address?.state || ''}
                  onChange={handleChange}
                  placeholder="NY"
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ZIP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ZIP
                </label>
                <input
                  name="address.zip"
                  type="text"
                  value={formData.address?.zip || ''}
                  onChange={handleChange}
                  placeholder="10001"
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <input
                  name="address.country"
                  type="text"
                  value={formData.address?.country || ''}
                  onChange={handleChange}
                  placeholder="USA"
                  className="mt-2 w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isEditing}>
              {isEditing ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
