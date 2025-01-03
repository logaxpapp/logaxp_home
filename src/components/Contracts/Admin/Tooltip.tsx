// src/components/common/Tooltip.tsx

import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative flex items-center">
      {children}
      <span className="absolute bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-gray-800 rounded-md whitespace-no-wrap group-hover:block">
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
