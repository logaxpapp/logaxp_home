// src/components/common/Form/FormLabel/FormLabel.types.ts

import { LabelHTMLAttributes } from 'react';

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}
