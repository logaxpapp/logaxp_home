// src/components/common/Form/FormGroup/FormGroup.tsx

import React from 'react';
import { FormGroupProps } from './FormGroup.types';

const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};

export default FormGroup;
