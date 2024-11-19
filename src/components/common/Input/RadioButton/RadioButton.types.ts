// src/components/common/Input/RadioButton/RadioButton.types.ts

import { InputHTMLAttributes } from 'react';

export interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
