// src/components/common/Feedback/Tooltip/Tooltip.tsx

import React, { useState } from 'react';
import { TooltipProps } from './Tooltip.types';

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {visible && (
        <div className={`absolute ${positionClasses[position]} bg-gray-700 text-white text-xs rounded py-1 px-2 z-10`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
