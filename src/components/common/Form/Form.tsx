// src/components/common/Form/Form.tsx

import React, { FormEvent } from 'react';
import { FormProps } from './Form.types';

const Form: React.FC<FormProps> = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

export default Form;
