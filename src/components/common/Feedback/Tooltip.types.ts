// src/components/common/Feedback/Tooltip/Tooltip.types.ts

import { ReactNode } from 'react';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}
