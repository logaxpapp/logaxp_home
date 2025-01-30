// src/pages/Auth/ResetPassword.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useResetPasswordMutation } from '../../api/usersApi';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const ResetPassword: React.FC = () => {
  // Extract the token from URL parameters
  const { token } = useParams<{ token: string }>();
  
  const navigate = useNavigate();

  // RTK Query mutation for resetting password
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  // Local state management
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Reference to success message for focus management
  const successRef = useRef<HTMLDivElement>(null);

  // Extract CSRF token from Redux store
  const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken);

  // Effect to handle focus on success
  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.focus();
    }
  }, [isSuccess]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newPassword || !confirmPassword) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    // Optional: More robust password validation (e.g., strength, length)
    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    try {
      // Perform the password reset mutation
      await resetPassword({ token: token || '', newPassword }).unwrap();
      setFormError(null);
    } catch (err: any) {
      // Handle errors returned from the mutation
      setFormError(err?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
              ref={successRef}
              tabIndex={-1} // Make it focusable
              aria-live="polite"
            >
              <FaCheckCircle className="mx-auto text-green-500 w-16 h-16" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Go to Login
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Reset Your Password
              </h2>

              {/* Display Form Error */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-100 text-red-700 p-3 rounded-md"
                  >
                    {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* New Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Enter new password"
                  />
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center"
                variants={{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }}
                whileHover={!isLoading ? 'hover' : ''}
                whileTap={!isLoading ? 'tap' : ''}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResetPassword;
