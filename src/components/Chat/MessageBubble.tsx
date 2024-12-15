// src/components/MessageBubble.tsx

import React, { useState } from 'react';
import { IMessage, Reaction } from '../../types/message';
import dayjs from 'dayjs';
import Modal from 'react-modal';
import { useToast } from '../../features/Toast/ToastContext';
import {
  AiOutlineUser,
  AiOutlineDownload,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSmile,
} from 'react-icons/ai';
import {
  useAddReactionMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
} from '../../api/messageApi';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  const emojis = ['👍', '❤️', '😂', '🎉', '😮', '😢'];

  return (
    <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded shadow-lg">
      {emojis.map((emoji) => (
        <span
          key={emoji}
          className="text-xl cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onSelect(emoji)}
          role="button"
          aria-label={`Add reaction ${emoji}`}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

interface MessageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({ onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <button
      onClick={onEdit}
      className="text-gray-500 hover:text-gray-700 transform hover:scale-110 transition-transform"
      aria-label="Edit Message"
    >
      <AiOutlineEdit size={20} />
    </button>
    <button
      onClick={onDelete}
      className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform"
      aria-label="Delete Message"
    >
      <AiOutlineDelete size={20} />
    </button>
  </div>
);

interface MessageBubbleProps {
  message: IMessage;
  isSent: boolean;
  userName?: string;
  userAvatar?: string;
  currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSent,
  userName,
  userAvatar,
  currentUserId,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newContent, setNewContent] = useState(message.content);
  const [addReaction] = useAddReactionMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [isReactionPickerVisible, setReactionPickerVisible] = useState(false);

  const { showToast } = useToast();

  const handleAddReaction = async (emoji: string) => {
    try {
      await addReaction({ messageId: message._id, emoji }).unwrap();
      showToast('Reaction added!', 'success', 3000);
      // Optionally emit the reaction via socket if needed
      // socket?.emit('add_reaction', { messageId: message._id, emoji });
    } catch (error) {
      console.error('Failed to add reaction:', error);
      showToast('Failed to add reaction.', 'error', 3000);
    } finally {
      setReactionPickerVisible(false);
    }
  };

  const handleEdit = async () => {
    try {
      await editMessage({ messageId: message._id, newContent }).unwrap();
      setIsEditModalOpen(false);
      showToast('Message edited successfully!', 'success', 3000);
    } catch (error) {
      console.error('Failed to edit message:', error);
      showToast('Failed to edit message.', 'error', 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message._id).unwrap();
      showToast('Message deleted successfully!', 'success', 3000);
    } catch (error) {
      console.error('Failed to delete message:', error);
      showToast('Failed to delete message.', 'error', 3000);
    }
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    const reactionCountMap = message.reactions.reduce(
      (acc: Record<string, number>, reaction: Reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
      },
      {}
    );

    return (
      <div className="flex items-center gap-2 mt-2 relative">
        {Object.entries(reactionCountMap).map(([emoji, count]) => (
          <div
            key={emoji}
            className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
            title={`Reactions: ${count}`}
          >
            <span>{emoji}</span>
            <span className="ml-1">{count}</span>
          </div>
        ))}
        <button
          className="text-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer"
          onClick={() => setReactionPickerVisible(!isReactionPickerVisible)}
          aria-label="Add Reaction"
        >
          <AiOutlineSmile />
        </button>
        {isReactionPickerVisible && (
          <div className="absolute bottom-full mb-2 right-0 z-10">
            <ReactionPicker onSelect={handleAddReaction} />
          </div>
        )}
      </div>
    );
  };

  console.log('Rendering Message:', message);
  console.log('Message Reactions:', message.reactions); // Debugging line

  return (
    <>
      <div
        className={`shadow-md rounded-lg ${
          isSent ? 'ml-auto bg-blue-100 dark:bg-blue-700' : 'mr-auto bg-gray-100 dark:bg-gray-700'
        } max-w-xl break-words p-4 relative`}
        style={{ maxWidth: '60%' }}
      >
        {!isSent && (
          <div className="flex items-center gap-2 mb-2">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={`${userName}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center">
                <AiOutlineUser className="text-white" />
              </div>
            )}
            <span className="font-semibold text-sm dark:text-white">{userName}</span>
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm dark:text-gray-200">
          {message.content}
          {message.edited && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(edited)</span>
          )}
        </p>
        {message.fileUrl && (
          <div className="mt-2">
            {/\.(jpg|jpeg|png|gif)$/i.test(message.fileUrl) ? (
              <img
                src={message.fileUrl}
                alt="attachment"
                className="rounded cursor-pointer hover:scale-105 transition-transform transform max-w-xs max-h-20 object-cover"
                onClick={() => setIsImageModalOpen(true)}
              />
            ) : (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 dark:text-blue-300 underline hover:text-blue-700 dark:hover:text-blue-500 mt-1"
              >
                <AiOutlineDownload />
                <span>Download File</span>
              </a>
            )}
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {dayjs(message.timestamp).format('h:mm A')}
          </span>
          {isSent && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.read ? 'Read' : 'Delivered'}
            </span>
          )}
        </div>

        {/* Reactions */}
        {renderReactions()}

        {/* Edit and Delete Buttons */}
        {isSent && message.sender === currentUserId && (
          <div className="absolute top-1 right-2 flex space-x-1">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transform hover:scale-110 transition-transform"
              aria-label="Edit Message"
            >
              <AiOutlineEdit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transform hover:scale-110 transition-transform"
              aria-label="Delete Message"
            >
              <AiOutlineDelete size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Modal for viewing image */}
      {message.fileUrl && /\.(jpg|jpeg|png|gif)$/i.test(message.fileUrl) && (
        <Modal
          isOpen={isImageModalOpen}
          onRequestClose={() => setIsImageModalOpen(false)}
          contentLabel="Image Modal"
          className="fixed inset-0 flex items-center justify-center p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-30"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close Image Modal"
            >
              <AiOutlineClose size={24} />
            </button>
            <img src={message.fileUrl} alt="attachment" className="w-full h-auto rounded" />
            <a
              href={message.fileUrl}
              download
              className="mt-4 inline-flex items-center text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-500 p-4"
            >
              <AiOutlineDownload className="mr-1" />
              Download Image
            </a>
          </div>
        </Modal>
      )}

      {/* Edit Message Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Message Modal"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      >
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close Edit Modal"
          >
            <AiOutlineClose size={24} />
          </button>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Message</h2>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit your message"
            aria-label="Edit Message Input"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
              aria-label="Cancel Edit"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
              aria-label="Save Edit"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MessageBubble;
