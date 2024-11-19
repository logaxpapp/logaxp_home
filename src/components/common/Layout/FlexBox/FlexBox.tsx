import React from 'react';
import { FlexBoxProps } from './FlexBox.types';

const FlexBox: React.FC<FlexBoxProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 4,
  wrap = false,
  className = '',
}) => {
  const directionClass = `flex-${direction}`;
  const justifyClass = `justify-${justify}`;
  const alignClass = `items-${align}`;
  const gapClass = `gap-${gap}`;
  const wrapClass = wrap ? 'flex-wrap' : '';

  return (
    <div className={`flex ${directionClass} ${justifyClass} ${alignClass} ${gapClass} ${wrapClass} ${className}`}>
      {children}
    </div>
  );
};

export default FlexBox;
