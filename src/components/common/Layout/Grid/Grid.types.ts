import { ReactNode } from 'react';

export interface GridProps {
  children: ReactNode;
  columns?:
    | number
    | {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        [key: string]: number | undefined;
      };
  gap?: number;
  className?: string;
}
