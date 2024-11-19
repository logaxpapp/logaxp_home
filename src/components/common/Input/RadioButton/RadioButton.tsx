// src/components/common/Input/RadioButton/RadioButton.tsx

import React from 'react';
import { RadioButtonProps } from './RadioButton.types';
import FormError from '../../Form/FormError';

const RadioButton: React.FC<RadioButtonProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="flex items-center">
        <input
          {...props}
          type="radio"
          className={`form-radio h-4 w-4 text-lemonGreen dark:bg-gray-700 dark:border-gray-600`}
        />
        {label && <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>}
      </label>
      {error && <FormError message={error} />}
    </div>
  );
};

export default RadioButton;
