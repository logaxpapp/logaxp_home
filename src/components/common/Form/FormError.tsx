// src/components/common/Form/FormError/FormError.tsx

import React from 'react';
import { FormErrorProps } from './FormError.types';

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};

export default FormError;
