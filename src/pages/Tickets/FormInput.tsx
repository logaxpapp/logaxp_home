// src/components/Input/FormInput.tsx
import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  children?: React.ReactNode; // For select options
  helpText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  value,
  placeholder,
  onChange,
  children,
  helpText,
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'select' ? (
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        {children}
      </select>
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    )}
    {helpText && <span className="text-xs text-gray-500 mt-1">{helpText}</span>}
  </div>
);

export default FormInput;
