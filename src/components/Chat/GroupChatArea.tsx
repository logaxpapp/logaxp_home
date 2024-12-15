// src/components/Chat/GroupChatArea.tsx

import React, { useRef, useEffect } from 'react';
import { IGroupMessage } from '../../types/groupMessage';
import dayjs from 'dayjs';
import GroupMessage from './GroupMessage'; // Import the GroupMessage component

interface GroupChatAreaProps {
  groupId: string;
  messages: IGroupMessage[];
  userId: string;
  className?: string;
}

const GroupChatArea: React.FC<GroupChatAreaProps> = ({
  groupId,
  messages,
  userId,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={`flex flex-col overflow-y-auto h-[600px] bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full ${className}`}
      aria-live="polite" // Announce new messages to screen readers
    >
      {messages.map((msg) => (
        <GroupMessage
          key={msg._id}
          message={msg}
          isSentByCurrentUser={msg.sender?._id === userId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default React.memo(GroupChatArea);
