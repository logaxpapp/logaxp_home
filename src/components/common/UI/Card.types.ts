import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  shadow?: boolean;
  padding?: string; // Accept Tailwind padding classes as a string
}
