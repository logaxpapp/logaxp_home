// src/pages/Profile.tsx

import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { useEditUserProfileMutation } from '../../api/usersApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser, setAuthCredentials } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';
import EditSectionModal from './EditSectionModal';
import Modal from '../../components/common/Feedback/Modal'; // Reusing the modal
import {
  IUser,
  IAddress,
  UserRole,
  Application
} from '../../types/user';
import { FaPencilAlt } from 'react-icons/fa'; // Import edit icon
import { uploadImage } from '../../services/cloudinaryService';

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
        <p className="text-gray-800 dark:text-white">Loading user data...</p>
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
    // **Key Change:** Initialize `sectionData` as an empty object if editing 'address' and no address exists
    if (section === 'address' && !user.address) {
      setSectionData({});
    } else {
      setSectionData(user[section]);
    }
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
      console.log('Updated User:', updatedUser); // Debugging log

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
      

       {/* Profile Picture and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8 space-y-4 md:space-y-0 relative">
        {/* Profile Picture Section */}
        <div className="relative">
          {user.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={`${user.name || 'User'}'s profile`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover cursor-pointer"
              onClick={openProfilePicModal}
            />
          ) : (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-xl sm:text-2xl cursor-pointer"
              onClick={openProfilePicModal}
            >
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          {/* Edit Icon Overlay */}
          <div
            className="absolute bottom-2 right-2 bg-blue-500 dark:bg-blue-400 text-white rounded-full p-2 cursor-pointer border-2 border-white shadow-md"
            onClick={openProfilePicModal}
            aria-label="Change Profile Picture"
            role="button"
          >
            <FaPencilAlt className="w-4 h-4" />
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="text-center md:text-left md:ml-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            {user.name || 'Unnamed User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {user.email || 'No Email Provided'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Role:</strong> {capitalizeFirstLetter(user.role)}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Status:</strong> {capitalizeFirstLetter(user.status)}
          </p>
        </div>
      </div>


        {/* Profile Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSection
            title="Job Title"
            value={user.job_title || 'Not Set'}
            onEdit={() => openEditModal('job_title')}
            isEditable={editableFields.includes('job_title')}
          />

          <ProfileSection
            title="Department"
            value={user.department || 'Not Set'}
            onEdit={() => openEditModal('department')}
            isEditable={editableFields.includes('department')}
          />

          <ProfileSection
            title="Employee ID"
            value={user.employee_id || 'Not Set'}
            onEdit={() => openEditModal('employee_id')}
            isEditable={editableFields.includes('employee_id')}
          />

          <ProfileSection
            title="Phone Number"
            value={user.phone_number || 'Not Set'}
            onEdit={() => openEditModal('phone_number')}
            isEditable={editableFields.includes('phone_number')}
          />

          <ProfileSection
            title="Address"
            value={user.address ? formatAddress(user.address) : 'Not Set'}
            onEdit={() => openEditModal('address')}
            isEditable={editableFields.includes('address')}
          />

          <ProfileSection
            title="Date of Birth"
            value={user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not Set'}
            onEdit={() => openEditModal('date_of_birth')}
            isEditable={editableFields.includes('date_of_birth')}
          />

          <ProfileSection
            title="Employment Type"
            value={user.employment_type || 'Not Set'}
            onEdit={() => openEditModal('employment_type')}
            isEditable={editableFields.includes('employment_type')}
          />

          <ProfileSection
            title="Onboarding Steps Completed"
            value={user.onboarding_steps_completed?.join(', ') || 'None'}
            onEdit={() => openEditModal('onboarding_steps_completed')}
            isEditable={editableFields.includes('onboarding_steps_completed')}
          />

          <ProfileSection
            title="Manager"
            value={user.manager ? (typeof user.manager === 'string' ? user.manager : user.manager.name) : 'Not Set'}
            onEdit={() => openEditModal('manager')}
            isEditable={editableFields.includes('manager')}
          />

          {user.applications_managed && user.applications_managed.length > 0 && (
            <ProfileSection
                title="Applications Managed"
                value={user.applications_managed.map((app) => Application[app] || app).join(', ') || 'None'}
                onEdit={() => openEditModal('applications_managed')}
                isEditable={editableFields.includes('applications_managed')}
              />
          
          )}

          {/* Non-Editable Sections */}
          <NonEditableSection title="Account Created" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Invalid Date'} />
          <NonEditableSection title="Last Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Invalid Date'} />
          <NonEditableSection title="Created By" value={user.createdBy || 'N/A'} />
          <NonEditableSection title="Updated By" value={user.updatedBy || 'N/A'} />
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <EditSectionModal
          isOpen={Boolean(editingSection)}
          onClose={closeEditModal}
          section={editingSection}
          // **Key Change:** Pass `sectionData` instead of `user[editingSection]`
          currentValue={sectionData}
          onSubmit={handleSectionUpdate}
        />
      )}

      {/* Profile Picture Upload Modal (Now Accessible to All Users) */}
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
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="secondary" onClick={closeProfilePicModal} disabled={uploading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProfilePictureUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

interface ProfileSectionProps {
  title: string;
  value: string;
  onEdit: () => void;
  isEditable: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, value, onEdit, isEditable }) => (
  <div className="flex justify-between items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
    <div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{value}</p>
    </div>
    {isEditable && (
      <Button variant="outline" size="small" onClick={onEdit} aria-label={`Edit ${title}`}>
        <FaPencilAlt className="text-gray-500 dark:text-gray-300" />
      </Button>
    )}
  </div>
);

interface NonEditableSectionProps {
  title: string;
  value: string;
}

const NonEditableSection: React.FC<NonEditableSectionProps> = ({ title, value }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
    <div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{value}</p>
    </div>
  </div>
);

// Utility function to format address
const formatAddress = (address: IAddress): string => {
  const { street, city, state, zip, country } = address;
  return [street, city, state, zip, country].filter(Boolean).join(', ');
};

// Utility function to capitalize the first letter
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default Profile;
