// src/components/SessionExpiredModal.tsx

import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectIsSessionExpired, setSessionExpired } from '../store/slices/sessionSlice';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/images/banner.jpeg';

const SessionExpiredModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSessionExpired = useAppSelector(selectIsSessionExpired);

  const handleLoginRedirect = () => {
    dispatch(setSessionExpired(false));
    navigate('/login');
  };

  if (!isSessionExpired) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto overflow-hidden">
        
        {/* Banner Image */}
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <img 
            src={bannerImage} 
            alt="Session Expired Banner" 
            className="object-cover w-full h-full"
          />
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 font-primary">Session Expired</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-secondary">
            For your security, your session has timed out. Please log in again to continue.
          </p>

          {/* Action Button */}
          <button
            onClick={handleLoginRedirect}
            className="flex items-center justify-center gap-2 bg-lemonGreen-light hover:bg-deepBlue-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-150 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 font-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
