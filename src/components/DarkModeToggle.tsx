import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import { RootState } from '../app/store';

import { FaLightbulb } from 'react-icons/fa';

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 w-10 h-9 rounded-full transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-lemonGreen focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <FaLightbulb className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaLightbulb className="w-5 h-5 text-lemonGreen-light" />
      )}
    </button>
  );
};

export default DarkModeToggle;
