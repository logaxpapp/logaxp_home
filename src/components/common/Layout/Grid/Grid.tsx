import React from 'react';
import { GridProps } from './Grid.types';

const columnClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const gapClasses: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
};

const Grid: React.FC<GridProps> = ({
  children,
  columns = { default: 1, md: 2, lg: 3 },
  gap = 4,
  className = '',
}) => {
  const gapClass = gapClasses[gap] || 'gap-4';

  let responsiveClasses = '';

  if (typeof columns === 'number') {
    // If columns is a number, apply the same number of columns across all breakpoints
    const colClass = columnClasses[columns];
    if (colClass) {
      responsiveClasses = colClass;
    } else {
      console.warn(`Invalid column count: ${columns}`);
    }
  } else if (typeof columns === 'object' && columns !== null) {
    // If columns is an object with breakpoints
    responsiveClasses = Object.entries(columns)
      .map(([breakpoint, cols]) => {
        if (typeof cols !== 'number') {
          return '';
        }
        const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
        const colClass = columnClasses[cols];
        if (colClass) {
          return `${prefix}${colClass}`;
        } else {
          console.warn(`Invalid column count: ${cols}`);
          return '';
        }
      })
      .filter(Boolean)
      .join(' ');
  }

  return (
    <div className={`grid ${responsiveClasses} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
