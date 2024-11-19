// src/components/common/Input/PasswordInput/PasswordInput.types.ts

import { InputHTMLAttributes } from 'react';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}
