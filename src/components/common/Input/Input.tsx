import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

// A detailed and reusable Input component
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        className={`mt-1 block w-full px-4 py-2 border ${
          error
            ? 'border-red-500'
            : 'border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${inputClassName}`}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
