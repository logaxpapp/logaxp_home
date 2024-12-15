// src/components/TypingIndicator.tsx

import React from 'react';

interface TypingIndicatorProps {
  userName: string;
  userAvatar?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName, userAvatar }) => (
  <div className="flex items-center gap-2 mb-2">
    {userAvatar ? (
      <img
        src={userAvatar}
        alt={`${userName}'s avatar`}
        className="w-6 h-6 rounded-full"
      />
    ) : (
      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-600">?</span>
      </div>
    )}
    <p className="text-sm text-gray-500">{userName} is typing...</p>
  </div>
);

export default TypingIndicator;
