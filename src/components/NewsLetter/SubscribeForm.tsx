// src/components/SubscribeForm.tsx

import React, { useState } from 'react';
import { useSubscribeMutation } from '../../api/newsletterApi';
import { useToast } from '../../features/Toast/ToastContext';
import { ClipLoader } from 'react-spinners';

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading }] = useSubscribeMutation();

    const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email.');
      return;
    }
    try {
      await subscribe({ email }).unwrap();
      showToast('Subscription successful! Please check your email to confirm.');
      setEmail('');
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to subscribe.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Subscribe to our Newsletter
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="you@example.com"
                required
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ClipLoader size={20} color="#3B82F6" />
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;
