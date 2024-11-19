// src/components/common/Input/SelectDropdown/SelectDropdown.types.ts

import { SelectHTMLAttributes } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  required?: boolean;
}
