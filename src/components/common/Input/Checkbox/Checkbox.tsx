// src/components/common/Input/Checkbox/Checkbox.tsx

import React from 'react';
import { CheckboxProps } from './Checkbox.types';
import FormError from '../../Form/FormError';

const Checkbox: React.FC<CheckboxProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="flex items-center">
        <input
          {...props}
          type="checkbox"
          className={`form-checkbox h-4 w-4 text-lemonGreen dark:bg-gray-700 dark:border-gray-600`}
        />
        {label && <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>}
      </label>
      {error && <FormError message={error} />}
    </div>
  );
};

export default Checkbox;
