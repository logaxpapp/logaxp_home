import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  errorMessage?: string; // Optional error message for validation
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  errorMessage,
}) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 tracking-wide"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input or Select */}
      {type === 'select' && options ? (
        <select
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={`block w-full px-4 py-3 text-gray-900 bg-white border ${
            errorMessage
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } rounded-md shadow-sm sm:text-sm`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full px-4 py-3 text-gray-900 bg-white border ${
            errorMessage
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormField;
