// src/pages/Unsubscribe.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useUnsubscribeQuery } from '../../api/newsletterApi';
import { ClipLoader } from 'react-spinners';
import { useToast } from '../../features/Toast/ToastContext';

const Unsubscribe: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { data, error, isLoading } = useUnsubscribeQuery(token!, {
    skip: !token,
  });

    const { showToast } = useToast();

  React.useEffect(() => {
    if (error) {
      showToast((error as any).data?.message || 'Failed to unsubscribe.');
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Unsubscribed</h1>
        <p className="text-gray-700">
          You have successfully unsubscribed from our newsletter.
        </p>
        <p className="text-gray-700 mt-2">
          If this was a mistake, you can{' '}
          <a href="/subscribe" className="text-blue-600 hover:text-blue-800 underline">
            subscribe again
          </a>.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Unsubscribe;
