// src/components/DarkModeToggle.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import { RootState } from '../store/store';
import { FaLightbulb } from 'react-icons/fa';

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      className=" w-12  p-1 bg-inherit"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <FaLightbulb className="w-6 h-6 text-yellow-400" />
      ) : (
        <FaLightbulb className="w-6 h-6 text-gray-900" />
      )}
    </button>
  );
};

export default DarkModeToggle;
