import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { useChangePasswordMutation } from '../../api/usersApi';
import { FaLock, FaKey, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [enable2FA, setEnable2FA] = useState(false);

  const { showToast } = useToast();

  const handlePasswordChange = async () => {
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      let errorMessage = 'Failed to update password.';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      showToast(errorMessage, 'error');
    }
  };

  const handle2FAToggle = () => {
    // Mock 2FA toggle - replace with actual API call
    setEnable2FA(!enable2FA);
    console.log('2FA toggled:', !enable2FA);
  };

  const togglePasswordVisibility = (field: 'current' | 'new') => {
    if (field === 'current') {
      setCurrentPasswordVisible((prev) => !prev);
    } else if (field === 'new') {
      setNewPasswordVisible((prev) => !prev);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-xl mx-auto mt-4 mb-20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-lemonGreen-light font-primary border-b pb-2 mb-4">
          Security Settings
        </h2>
        <p className="text-gray-600 mt-2 dark:text-gray-50">
          Manage your account security settings, including password updates and two-factor authentication.
        </p>
      </div>

      {/* Password Change Section */}
      <div className="mb-8 bg-gray-100 dark:bg-gray-600 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center dark:text-lemonGreen-light">
          <FaLock className="mr-2 text-red-500 " /> Change Password
        </h3>
        <div className="relative mb-4">
          <input
            type={currentPasswordVisible ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            {currentPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type={newPasswordVisible ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Button
          variant="primary"
          onClick={handlePasswordChange}
          leftIcon={<FaKey />}
          isLoading={isLoading}
        >
          Update Password
        </Button>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center dark:text-lemonGreen-light">
          <FaShieldAlt className="mr-2 text-green-500" /> Two-Factor Authentication
        </h3>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={enable2FA}
            onChange={handle2FAToggle}
            className="form-checkbox h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500"
          />
          <label className="ml-2 text-gray-700 dark:text-gray-50">
            Enable Two-Factor Authentication
          </label>
        </div>
        <p className="text-gray-600 text-sm">
          {enable2FA
            ? 'Two-factor authentication is enabled. You will need to enter a verification code from your mobile device when logging in.'
            : 'Enable two-factor authentication for added security on your account.'}
        </p>
      </div>
    </div>
  );
};

export default Security;
