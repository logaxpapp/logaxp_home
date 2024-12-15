// src/pages/Profile.tsx

import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { useEditUserProfileMutation } from '../../api/usersApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser, setAuthCredentials } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';
import EditSectionModal from './EditSectionModal';
import Modal from '../../components/common/Feedback/Modal';
import {
  IUser,
  IAddress,
  UserRole,
  Application
} from '../../types/user';
import ProfileHeader from './ProfileHeader';
import { uploadImage } from '../../services/cloudinaryService';
import ProfileCard from './ProfileCard';
import LoadingSpinner from '../../components/Loader';

const Profile: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [editProfile] = useEditUserProfileMutation();
  const { showToast } = useToast();

  // State to manage which section is being edited
  const [editingSection, setEditingSection] = useState<keyof IUser | null>(null);
  const [sectionData, setSectionData] = useState<any>({});

  // State to manage profile picture modal
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Early return if user is null to prevent type errors
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Destructure role for easier access and to assist TypeScript in type narrowing
  const { role } = user;

  // Determine editable fields based on user role
  const editableFields: Array<keyof IUser> =
    role === UserRole.Admin
      ? [
          'name',
          'email',
          'job_title',
          'department',
          'employee_id',
          'phone_number',
          'address',
          'date_of_birth',
          'employment_type',
          'onboarding_steps_completed',
          'applications_managed',
          'manager',
          'profile_picture_url',
        ]
      : ['address', 'phone_number'];

  // Function to open the edit modal
  const openEditModal = (section: keyof IUser) => {
    setEditingSection(section);
    setSectionData(section === 'address' && !user.address ? {} : user[section]);
  };

  const closeEditModal = () => {
    setEditingSection(null);
    setSectionData({});
  };

  const handleSectionUpdate = async (updatedData: Partial<IUser>) => {
    if (!user._id) {
      showToast('User ID is missing. Please try again later.', 'error');
      return;
    }

    try {
      const updatedUser = await editProfile({ userId: user._id, updates: updatedData }).unwrap();

      // Validate that essential fields are present
      if (!updatedUser.name || !updatedUser.email) {
        showToast('Profile updated, but some fields are missing. Please contact support.');
      } else {
        showToast('Profile updated successfully!', 'success');
      }

      // Update the authSlice with the new user data
      dispatch(setAuthCredentials({ user: updatedUser }));
    } catch (err: any) {
      console.error('Update failed:', err);
      showToast('Update failed. Please try again.', 'error');
    } finally {
      closeEditModal();
    }
  };

  const openProfilePicModal = () => {
    setIsProfilePicModalOpen(true);
  };

  const closeProfilePicModal = () => {
    setIsProfilePicModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImage(selectedFile);
      await handleSectionUpdate({ profile_picture_url: imageUrl });
      showToast('Profile picture updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to upload profile picture. Please try again.', 'error');
    } finally {
      setUploading(false);
      closeProfilePicModal();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className=" mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
       
      <ProfileHeader user={user} openProfilePicModal={openProfilePicModal} />
        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editable Sections */}
          {editableFields.map((field) => (
            <ProfileCard
              key={field}
              title={getFieldTitle(field)}
              value={getFieldValue(user, field)}
              onEdit={() => openEditModal(field)}
              isEditable={true}
            />
          ))}

          {/* Non-Editable Sections */}
          <ProfileCard
            title="Account Created"
            value={formatDate(user.createdAt)}
            isEditable={false}
          />
          <ProfileCard
            title="Last Updated"
            value={formatDate(user.updatedAt)}
            isEditable={false}
          />
          <ProfileCard
            title="Created By"
            value={user.createdBy || 'N/A'}
            isEditable={false}
          />
          <ProfileCard
            title="Updated By"
            value={user.updatedBy || 'N/A'}
            isEditable={false}
          />
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <EditSectionModal
          isOpen={Boolean(editingSection)}
          onClose={closeEditModal}
          section={editingSection}
          currentValue={sectionData}
          onSubmit={handleSectionUpdate}
        />
      )}

      {/* Profile Picture Upload Modal */}
      <Modal
        isOpen={isProfilePicModalOpen}
        onClose={closeProfilePicModal}
        title="Update Profile Picture"
      >
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100
                   dark:file:bg-gray-600 dark:file:text-gray-300
                   dark:hover:file:bg-gray-500"
            aria-label="Choose Profile Picture"
          />
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile Preview"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md"
            />
          )}
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <Button variant="secondary" onClick={closeProfilePicModal} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProfilePictureUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Utility Functions

// Maps IUser keys to user-friendly titles
// Define a type for the specific keys you want to map
type MappedUserKeys = 
  | 'name'
  | 'email'
  | 'job_title'
  | 'department'
  | 'employee_id'
  | 'phone_number'
  | 'address'
  | 'date_of_birth'
  | 'employment_type'
  | 'onboarding_steps_completed'
  | 'applications_managed'
  | 'manager'
  | 'profile_picture_url'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy';

const getFieldTitle = (field: keyof IUser): string => {
  const titles: Record<MappedUserKeys, string> = {
    name: 'Full Name',
    email: 'Email Address',
    job_title: 'Job Title',
    department: 'Department',
    employee_id: 'Employee ID',
    phone_number: 'Phone Number',
    address: 'Address',
    date_of_birth: 'Date of Birth',
    employment_type: 'Employment Type',
    onboarding_steps_completed: 'Onboarding Steps',
    applications_managed: 'Applications Managed',
    manager: 'Manager',
    profile_picture_url: 'Profile Picture',
    createdAt: 'Account Created',
    updatedAt: 'Last Updated',
    createdBy: 'Created By',
    updatedBy: 'Updated By',
  };
  
  // Type assertion to ensure field is within MappedUserKeys
  if (field in titles) {
    return titles[field as MappedUserKeys];
  }
  
  return field; // Fallback if not mapped
};

const getFieldValue = (user: IUser, field: keyof IUser): string => {
  switch (field) {
    case 'address':
      return user.address ? formatAddress(user.address) : 'Not Set';
    case 'date_of_birth':
      return user.date_of_birth
        ? new Date(user.date_of_birth).toLocaleDateString()
        : 'Not Set';
    case 'onboarding_steps_completed':
      return user.onboarding_steps_completed?.join(', ') || 'None';
    case 'applications_managed':
      return user.applications_managed
        ?.map((app) => Application[app] || app)
        .join(', ') || 'None';
    case 'manager':
      if (user.manager) {
        return typeof user.manager === 'string'
          ? `Manager ID: ${user.manager}`
          : user.manager.name || 'Not Set';
      }
      return 'Not Set';
    case 'profile_picture_url':
      return user.profile_picture_url ? 'Uploaded' : 'Not Set';
    default:
      return user[field] !== undefined && user[field] !== null
        ? String(user[field])
        : 'Not Set';
  }
};



// Formats the address object into a readable string
const formatAddress = (address: IAddress): string => {
  const { street, city, state, zip, country } = address;
  return [street, city, state, zip, country].filter(Boolean).join(', ');
};

// Formats date strings into a readable format
const formatDate = (dateString?: string): string => {
  return dateString ? new Date(dateString).toLocaleDateString() : 'Invalid Date';
};

// Capitalizes the first letter of a string
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default Profile;
