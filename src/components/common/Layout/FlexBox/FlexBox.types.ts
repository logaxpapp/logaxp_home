import { ReactNode } from 'react';

export interface FlexBoxProps {
  children: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'stretch' | 'start' | 'center' | 'end' | 'baseline';
  gap?: number;
  wrap?: boolean;
  className?: string;
}
