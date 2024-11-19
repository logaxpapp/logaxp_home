import React from 'react';
import {
  FaGoogle,
  FaCalendarAlt,
  FaSignOutAlt,
  FaSyncAlt,
  FaSpinner
} from 'react-icons/fa';
import { useInitiateGoogleAuthMutation, useDisconnectGoogleAccountMutation } from '../../api/usersApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser, setGoogleConnected } from '../../store/slices/authSlice';

const IntegrateGoogle: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const userId = user?._id;
  const isGoogleConnected = user?.googleConnected || false;
  const dispatch = useAppDispatch();

  const [initiateGoogleAuth, { isLoading: isInitiating }] = useInitiateGoogleAuthMutation();
  const [disconnectGoogleAccount, { isLoading: isDisconnecting }] = useDisconnectGoogleAccountMutation();

  const handleConnect = async () => {
    if (!userId) {
      alert('User not authenticated.');
      return;
    }

    try {
      const response = await initiateGoogleAuth(userId).unwrap();
      window.location.href = response.url;
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      alert('Failed to initiate Google OAuth.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectGoogleAccount().unwrap();
      dispatch(setGoogleConnected(false));
      alert('Disconnected from Google Account successfully.');
      window.location.href = "/integrate-google";
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      alert('Failed to disconnect. Please try again.');
    }
  };

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-600">
      <h2 className="text-3xl font-bold text-blue-800 font-primary dark:text-lemonGreen-light">Google integration</h2>
      </div>
      <div className="bg-white dark:bg-gray-600 shadow-md rounded-lg w-full p-8 md:p-12 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200">
        {/* Header Section */}
        <header className="w-full flex flex-col items-center mb-6">
          <FaGoogle className="text-blue-600 text-6xl mb-3" />
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Integrate with Google</h2>
          <p className="text-gray-500 mt-2 max-w-md dark:text-gray-50">
            Link your Google account to enable seamless event syncing with your Shift Calendar.
          </p>
        </header>
        
        {/* Main Content */}
        <main className="w-full mt-4 flex flex-col items-center gap-4 ">
          {!isGoogleConnected ? (
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleConnect}
              disabled={isInitiating}
              aria-label="Sync Shifts with Google Calendar"
              title="Click to sync your shifts with Google Calendar"
            >
              {isInitiating ? (
                <FaSpinner className="animate-spin w-4 h-4" />
              ) : (
                <FaSyncAlt className="w-4 h-4" />
              )}
              <span>Sync with Google</span>
            </button>
          ) : (
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={() => (window.location.href = "/dashboard/shift-calendar")}
                className="flex items-center gap-2 bg-lemonGreen-light font-semibold text-white py-3 px-5 rounded-lg shadow-sm hover:bg-green-600 transition duration-150"
              >
                <FaCalendarAlt className="w-4 h-4" />
                <span>View Shift Calendar</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 bg-red-500 text-white py-3 px-5 rounded-lg shadow-sm hover:bg-red-600 transition duration-150"
              >
                {isDisconnecting ? <FaSpinner className="animate-spin w-4 h-4" /> : <FaSignOutAlt className="w-4 h-4" />}
                <span>Disconnect Google </span>
              </button>
            </div>
          )}
        </main>
        
        {/* Footer Section */}
        <footer className="w-full mt-6">
          <p className="text-sm text-gray-400">
            Keeping your Google account linked ensures your calendar stays up-to-date.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default IntegrateGoogle;
