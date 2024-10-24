// src/pages/PasswordReset/PasswordReset.tsx

import React, { useState } from 'react';
import { usePasswordResetMutation } from '../../api/apiSlice'; // Define this mutation in apiSlice.ts
import { Link } from 'react-router-dom';

const PasswordReset: React.FC = () => {
  const [passwordReset, { isLoading, error, isSuccess }] = usePasswordResetMutation();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }

    try {
      await passwordReset({ email }).unwrap();
      setFormError(null);
    } catch (err) {
      setFormError('Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Reset Your Password</h2>
        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Password reset email sent successfully!</p>
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 border ${
                  formError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="you@example.com"
              />
              {formError && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  An error occurred. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
