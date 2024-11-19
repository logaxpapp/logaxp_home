// src/components/common/Form/Form.types.ts

import { FormEvent, ReactNode } from 'react';

export interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}
