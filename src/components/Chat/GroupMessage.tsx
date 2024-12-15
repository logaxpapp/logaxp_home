// src/components/Chat/GroupMessage.tsx

import React from 'react';
import { IGroupMessage } from '../../types/groupMessage';
import dayjs from 'dayjs';
import { Avatar, Typography, Tooltip } from 'antd';
import { UserOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface GroupMessageProps {
  message: IGroupMessage;
  isSentByCurrentUser: boolean;
}

const GroupMessage: React.FC<GroupMessageProps> = ({ message, isSentByCurrentUser }) => {
  const renderAttachment = () => {
    if (!message.fileUrl) return null;

    const fileExtension = message.fileUrl.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];

    // Common container for the attachment section
    const containerClasses = "flex items-center gap-3 mt-4";

    // For images
    if (imageExtensions.includes(fileExtension || '')) {
      return (
        <div className={containerClasses}>
          {/* Image Thumbnail */}
          <div className="relative w-24 h-24 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 shadow-sm">
            <img
              src={message.fileUrl}
              alt="Image Attachment"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Controls for viewing and downloading */}
          <div className="flex flex-col gap-1">
            {/* View Image */}
            <Tooltip title="View Image">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Image in new tab"
                className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1"
              >
                <EyeOutlined />
                <Text className="text-sm">View</Text>
              </a>
            </Tooltip>
            
            {/* Download Image */}
            <Tooltip title="Download Image">
              <a
                href={message.fileUrl}
                download
                aria-label="Download Image"
                className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1"
              >
                <DownloadOutlined />
                <Text className="text-sm">Download</Text>
              </a>
            </Tooltip>
          </div>
        </div>
      );
    }

    // For videos (if you decide to keep it simpler, you could handle similarly)
    if (videoExtensions.includes(fileExtension || '')) {
      return (
        <div className={containerClasses}>
          <div className="relative w-24 h-24 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 shadow-sm bg-black flex items-center justify-center text-white text-sm">
            <Text className="text-center">Video</Text>
          </div>

          <div className="flex flex-col gap-1">
            <Tooltip title="View Video">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Video in new tab"
                className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1"
              >
                <EyeOutlined />
                <Text className="text-sm">View</Text>
              </a>
            </Tooltip>

            <Tooltip title="Download Video">
              <a
                href={message.fileUrl}
                download
                aria-label="Download Video"
                className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1"
              >
                <DownloadOutlined />
                <Text className="text-sm">Download</Text>
              </a>
            </Tooltip>
          </div>
        </div>
      );
    }

    // For other file types
    return (
      <div className={`${containerClasses} flex-col items-start`}>
        <Tooltip title="Download File">
          <a
            href={message.fileUrl}
            download
            aria-label="Download Attachment"
            className="text-blue-600 dark:text-blue-300 underline hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <DownloadOutlined className="text-base" />
            <Text className="text-sm">Download File</Text>
          </a>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className={`flex mb-6 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative p-4 rounded-2xl max-w-sm break-words shadow-md 
        ${isSentByCurrentUser 
          ? 'bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-gray-100' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        }`}
      >
        {/* Sender Information */}
        {!isSentByCurrentUser && message.sender && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar
              src={message.sender.profile_picture_url}
              icon={!message.sender.profile_picture_url && <UserOutlined />}
              size="small"
              alt={`${message.sender.name}'s avatar`}
            />
            <Text strong className="text-sm text-gray-900 dark:text-white">
              {message.sender.name || 'Unknown User'}
            </Text>
          </div>
        )}

        {/* Message Content */}
        <Text className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </Text>

        {/* Attachment */}
        {renderAttachment()}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-300 mt-2 text-right">
          {dayjs(message.timestamp).format('h:mm A')}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GroupMessage);
