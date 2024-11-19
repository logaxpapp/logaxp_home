// src/components/Profile/EditSectionModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Feedback/Modal';
import Button from '../../components/common/Button/Button';
import {
  IUser,
  IAddress,
  Application,
  Department,
  OnboardingStepStatus,
  EmploymentType,
  JobTitle,
  UserRole,
  UserStatus,
} from '../../types/user';
import { uploadImage } from '../../services/cloudinaryService'; // Import the upload service

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: keyof IUser;
  currentValue: any;
  onSubmit: (updatedData: Partial<IUser>) => void;
}

const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  currentValue,
  onSubmit,
}) => {
  const [value, setValue] = useState<any>(currentValue);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setValue(currentValue);
    setError('');
  }, [currentValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
    setError('');
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    setValue((prev: IAddress) => ({ ...prev, [name]: inputValue }));
    setError('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Validate file type and size here
    try {
      setUploading(true);
      const uploadedUrl = await uploadImage(file);
      setValue(uploadedUrl);
    } catch (uploadError: any) {
      setError(uploadError.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation based on section
    if (section === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    // Additional validations can be added here based on the section

    onSubmit({ [section]: value });
  };

  const renderFormField = () => {
    switch (section) {
      case 'name':
        return (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={value}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
              required
            />
          </div>
        );
      case 'email':
        return (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={value}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
              required
            />
          </div>
        );
      case 'job_title':
        return (
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <select
              id="jobTitle"
              name="jobTitle"
              value={value || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Job Title</option>
              {Object.values(JobTitle).map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        );
      case 'department':
        return (
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={value || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Department</option>
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        );
      case 'employee_id':
        return (
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={value}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
          </div>
        );
      case 'phone_number':
        return (
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={value}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="street"
              value={value.street || ''}
              onChange={handleAddressChange}
              placeholder="Street"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            <input
              type="text"
              name="city"
              value={value.city || ''}
              onChange={handleAddressChange}
              placeholder="City"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            <input
              type="text"
              name="state"
              value={value.state || ''}
              onChange={handleAddressChange}
              placeholder="State"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            <input
              type="text"
              name="zip"
              value={value.zip || ''}
              onChange={handleAddressChange}
              placeholder="ZIP Code"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            <input
              type="text"
              name="country"
              value={value.country || ''}
              onChange={handleAddressChange}
              placeholder="Country"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
          </div>
        );
      case 'date_of_birth':
        return (
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={value ? new Date(value).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
          </div>
        );
      case 'employment_type':
        return (
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={value || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Employment Type</option>
              {Object.values(EmploymentType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        );
      case 'onboarding_steps_completed':
        return (
          <div>
            <label htmlFor="onboardingSteps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Onboarding Steps Completed
            </label>
            <select
              id="onboardingSteps"
              name="onboardingSteps"
              multiple
              value={value}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value as OnboardingStepStatus
                );
                setValue(selectedOptions);
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              aria-label="Onboarding Steps Completed"
            >
              {Object.values(OnboardingStepStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.
            </p>
          </div>
        );
      case 'applications_managed':
        return (
          <div>
            <label htmlFor="applicationsManaged" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Applications Managed
            </label>
            <select
              id="applicationsManaged"
              name="applicationsManaged"
              multiple
              value={value}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value as Application
                );
                setValue(selectedOptions);
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              aria-label="Applications Managed"
            >
              {Object.values(Application).map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.
            </p>
          </div>
        );
      case 'manager':
        return (
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Manager
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={value ? (typeof value === 'string' ? value : value.name) : ''}
              onChange={handleChange}
              placeholder="Manager's Name"
              className={`mt-1 block w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200`}
            />
          </div>
        );
      case 'profile_picture_url':
        return (
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100
                     dark:file:bg-gray-600 dark:file:text-gray-300
                     dark:hover:file:bg-gray-500"
              aria-label="Choose Profile Picture"
            />
            {uploading && <p className="text-gray-500">Uploading...</p>}
            {value && !uploading && (
              <img src={value} alt="Profile Preview" className="mt-4 w-24 h-24 rounded-full object-cover" />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const formatSectionTitle = (section: keyof IUser) => {
    switch (section) {
      case 'job_title':
        return 'Job Title';
      case 'department':
        return 'Department';
      case 'employee_id':
        return 'Employee ID';
      case 'phone_number':
        return 'Phone Number';
      case 'address':
        return 'Address';
      case 'date_of_birth':
        return 'Date of Birth';
      case 'employment_type':
        return 'Employment Type';
      case 'onboarding_steps_completed':
        return 'Onboarding Steps Completed';
      case 'applications_managed':
        return 'Applications Managed';
      case 'manager':
        return 'Manager';
      case 'profile_picture_url':
        return 'Profile Picture';
      default:
        return section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${formatSectionTitle(section)}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormField()}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={uploading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSectionModal;
