import React, { useState } from 'react';
import { usePasswordResetMutation } from '../../api/usersApi'; 
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lemonGreen via-lemonGreen-light to-lemonGreen-dark">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md space-y-6 transform transition-all duration-500 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Reset Your Password</h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email, and we'll send you instructions to reset your password.
        </p>
        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium text-lg">
              Password reset email sent successfully!
            </p>
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
            >
              <FaArrowLeft className="mr-2" /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="relative mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pl-12 border ${
                    formError ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`}
                  placeholder="you@example.com"
                />
                <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              </div>
              {formError && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
             
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400"
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
