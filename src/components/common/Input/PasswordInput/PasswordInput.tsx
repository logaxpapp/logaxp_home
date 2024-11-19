// src/components/common/Input/PasswordInput.tsx

import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  label: string;
  name: string;
  type: 'password' | 'text';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  toggleVisibility: () => void; // Function to toggle password visibility
  showPassword: boolean; // Current state of password visibility
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  toggleVisibility,
  showPassword,
  ...inputProps // Collect all other props intended for the input
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={inputProps.name} className="block text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps} // Spread only the input-specific props
          className={`w-full p-2 border rounded ${
            inputProps.error ? 'border-red-500' : 'border-gray-300'
          } dark:bg-gray-700 dark:text-white`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 dark:text-gray-300"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {inputProps.error && <p className="text-red-500 text-sm mt-1">{inputProps.error}</p>}
    </div>
  );
};

export default PasswordInput;
