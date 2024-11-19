// src/components/common/Input/SelectDropdown/SelectDropdown.tsx

import React from 'react';
import { SelectDropdownProps } from './SelectDropdown.types';
import FormLabel from '../../Form/FormLabel';
import FormError from '../../Form/FormError';

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, options, error, required, ...props }) => {
  return (
    <div className="mb-4">
      {label && <FormLabel htmlFor={props.id}>{label}{required && ' *'}</FormLabel>}
      <select
        {...props}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-lemonGreen ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <FormError message={error} />}
    </div>
  );
};

export default SelectDropdown;
