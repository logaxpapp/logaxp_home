// src/components/common/Form/FormLabel/FormLabel.tsx

import React from 'react';
import { FormLabelProps } from './FormLabel.types';

const FormLabel: React.FC<FormLabelProps> = ({ children, ...props }) => {
  return (
    <label {...props} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {children}
    </label>
  );
};

export default FormLabel;
