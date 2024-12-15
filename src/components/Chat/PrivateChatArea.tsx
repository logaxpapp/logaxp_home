// src/components/PrivateChatArea.tsx

import React, { useEffect, useRef, useMemo } from 'react';
import { IMessage } from '../../types/message';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator'; 


interface PrivateChatAreaProps {
  messages: IMessage[];
  userId: string;
  participantId: string;
  isTyping?: boolean; // Optional prop for typing indicators
  typingUserName?: string;
  typingUserAvatar?: string;
}

const PrivateChatArea: React.FC<PrivateChatAreaProps> = ({
  messages,
  userId,
  participantId,
  isTyping,
  typingUserName,
  typingUserAvatar,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: usersData } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000,
  });

  const usersMap = useMemo(() => {
    const map = new Map<string, { name: string; profile_picture_url: string }>();
    usersData?.users.forEach((user) => {
      map.set(user._id, {
        name: user.name,
        profile_picture_url: user.profile_picture_url || '',
      });
    });
    return map;
  }, [usersData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-md">
      {messages.map((msg, index) => {
        const isSent = msg.sender === userId;
        const user = usersMap.get(msg.sender);

        // Generate a unique key combining `_id` and `timestamp` with index fallback
        const uniqueKey = `${msg._id || 'temp'}-${index}`;

        return (
          <MessageBubble
            key={uniqueKey}
            message={msg}
            isSent={isSent}
            userName={user?.name || `User ${msg.sender}`}
            userAvatar={user?.profile_picture_url}
            currentUserId={userId}
          />
        );
      })}

      {/* Typing Indicator */}
      {isTyping && typingUserName && (
        <TypingIndicator userName={typingUserName} userAvatar={typingUserAvatar} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default PrivateChatArea;
