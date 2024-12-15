// src/components/Chat/Chat.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
  useGetConversationQuery, 
  useSendPrivateMessageMutation, 
  useSendGroupMessageMutation,
  useMarkMessagesAsReadMutation 
} from '../../api/messageApi';
import { 
  useGetUserGroupsQuery, 
  useCreateGroupMutation, 
  useAddMemberMutation, 
  useRemoveMemberMutation, 
  useGetGroupDetailsQuery,
  useGetGroupMessagesQuery
} from '../../api/groupApi';
import type { UploadFile } from 'antd';

import { useFetchAllUsersQuery } from '../../api/usersApi';
import { setMessages, addMessage } from '../../store/slices/messageSlice';
import { setGroupMessages, addGroupMessage } from '../../store/slices/groupMessageSlice';
import { Input, Button, Upload, message as AntMessage, Form, Typography } from 'antd';
import { UploadOutlined, SmileOutlined } from '@ant-design/icons';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { IMessage } from '../../types/message';
import { IGroupMessage } from '../../types/groupMessage';
import EmojiPicker from 'emoji-picker-react';
import { IUser } from '../../types/user';
import { getSocket } from '../../socket';
import GroupChatArea from './GroupChatArea';
import PrivateChatArea from './PrivateChatArea'; 
import GroupDetails from './GroupDetails'; // Import GroupDetails
import { uploadImage } from '../../services/cloudinaryService';
import Sidebar from './Sidebar'; // Import Sidebar
import CreateGroupModal from './CreateGroupModal'; // Import CreateGroupModal
import { RcFile } from 'antd/lib/upload'; // Ensure RcFile is imported

const { Title, Text } = Typography;

const Chat: React.FC = () => {
  // Extract chatType and chatId from URL parameters
  const { chatType, chatId } = useParams<{ chatType: string; chatId: string }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [participantName, setParticipantName] = useState<string | null>(null);

  const [groupPage, setGroupPage] = useState(1);
  const [groupSearch, setGroupSearch] = useState('');
  const groupPageSize = 5;

  // Fetch conversation messages only if chatType is 'user'
  const { data: conversationData, isLoading: isConversationLoading, error: conversationError } = useGetConversationQuery(chatType === 'user' ? chatId! : '', {
    skip: chatType !== 'user' || !chatId,
  });

  // Fetch all users with pagination
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useFetchAllUsersQuery({
    page: currentPage,
    limit: pageSize,
  });

  // Fetch user groups
  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    error: groupsError,
  } = useGetUserGroupsQuery({
    page: groupPage,
    limit: groupPageSize,
    search: groupSearch, // API-based search for groups
  });

  useEffect(() => {
    if (usersData?.users) {
      const searchResult = usersData.users.filter((user) =>
        user.name?.toLowerCase().includes(userSearch.toLowerCase())
      );
      setFilteredUsers(searchResult);
    }
  }, [userSearch, usersData]);

  // Create group mutation
  const [createGroup] = useCreateGroupMutation();

  // Add and remove member mutations
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  // Fetch group details and messages when a group is selected
  const { data: groupDetails, isLoading: isGroupDetailsLoading, error: groupDetailsError } = useGetGroupDetailsQuery(chatId!, {
    skip: chatType !== 'group' || !chatId,
  });

  const { data: groupMessagesData, isLoading: isGroupMessagesLoading, error: groupMessagesError } = useGetGroupMessagesQuery(chatId!, {
    skip: chatType !== 'group' || !chatId,
  });

  const [sendPrivateMessage] = useSendPrivateMessageMutation();
  const [sendGroupMessage] = useSendGroupMessageMutation();

  // Access private and group messages from Redux
  const messages: IMessage[] = useAppSelector((state) => state.messages.messages);
  const groupMessages = useAppSelector((state) => state.groupMessages.messages);

  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  const userId = user?._id || '';
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const [form] = Form.useForm();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const socket = getSocket();

  // Determine current chat
  const participantId = chatType === 'user' ? chatId : null;
  const currentGroupId = chatType === 'group' ? chatId : null;

  // Fetch and set private conversation messages
  useEffect(() => {
    if (chatType === 'user' && conversationData) {
      const validatedData = conversationData.map((msg) => ({
        ...msg,
        _id: msg._id || `${msg.sender}-${msg.timestamp}`, // Generate a fallback `_id` if it's undefined
      }));
      dispatch(setMessages(validatedData));
    }
  }, [dispatch, conversationData, chatType]);

  // Fetch and set group messages
  useEffect(() => {
    if (chatType === 'group' && chatId && groupMessagesData) {
      dispatch(setGroupMessages({ groupId: chatId, messages: groupMessagesData }));
    }
  }, [dispatch, chatType, chatId, groupMessagesData]);

  // Real-time socket handling
  useEffect(() => {
    if (socket) {
      // Handle private messages
      socket.on('private_message', (message: IMessage) => {
        if (chatType === 'user' && (message.sender === chatId || message.receiver === chatId)) {
          dispatch(addMessage(message));
        }
      });

      // Handle group messages
      socket.on('group_message', (message: IGroupMessage) => {
        if (chatType === 'group' && message.groupId === chatId) {
          dispatch(addGroupMessage(message));
        }
      });

      // Handle typing indicators for private chat
      socket.on('typing', (data: { from: string }) => {
        if (chatType === 'user' && data.from === chatId) {
          setIsTyping(true);
          // Hide the indicator after a timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
        }
      });

      // Handle typing indicators for group chat (optional)
      // Implement similarly if needed
    }

    return () => {
      if (socket) {
        socket.off('private_message');
        socket.off('group_message');
        socket.off('typing');
      }
    };
  }, [socket, dispatch, chatType, chatId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, groupMessages]);

  // Handle group creation
  const handleCreateGroup = async (values: { name: string; members: string[] }) => {
    try {
      await createGroup(values).unwrap();
      AntMessage.success('Group created successfully');
      setShowCreateGroupModal(false);
      form.resetFields();
      // RTK Query will automatically refetch `getUserGroups` due to cache invalidation
    } catch (error: any) {
      AntMessage.error(error.data?.message || 'Failed to create group');
      console.error('Create group error:', error);
    }
  };

  // Mark messages as read when chatId changes (for private chats)
  useEffect(() => {
    if (chatType === 'user' && participantId) {
      markMessagesAsRead(participantId)
        .unwrap()
        .catch((error) => {
          console.error('Failed to mark messages as read:', error);
        });
    }
  }, [chatType, participantId, markMessagesAsRead]);

  // Set participant name based on chat type
  useEffect(() => {
    if (chatType === 'user' && chatId && usersData?.users) {
      const participant = usersData.users.find((user) => user._id === chatId);
      setParticipantName(participant?.name || 'Unknown User');
    } else if (chatType === 'group' && groupDetails) {
      setParticipantName(groupDetails.name || 'Unknown Group');
    } else {
      setParticipantName(null);
    }
  }, [chatType, chatId, usersData, groupDetails]);

  const validTimestamp = (timestamp: string | undefined): string => {
    return timestamp && !isNaN(Date.parse(timestamp))
      ? new Date(timestamp).toISOString()
      : new Date().toISOString();
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  // Handle adding files
  const handleBeforeUpload = (file: RcFile): boolean => {
    const newFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      originFileObj: file,
    };
    setFileList((prevList) => [...prevList, newFile]);
    return false; // Prevent automatic upload
  };

  // Handle removing files
  const handleRemove = (file: UploadFile<any>): boolean => {
    setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
    return true; // Indicate removal
  };

  // Emit typing event
  const handleTyping = () => {
    if (chatType === 'user' && participantId) {
      socket?.emit('typing', { to: participantId });
    }
    // Implement typing indicators for group chat if needed
  };

  // Define sendMessage function
  const sendMessage = async () => {
    if (!chatType || !chatId) {
      AntMessage.error('No user or group selected!');
      return;
    }

    if (!inputValue.trim() && fileList.length === 0) {
      return; // Prevent sending empty messages
    }

    let fileUrl: string | undefined;
    if (fileList.length > 0) {
      try {
        // Assuming you have an uploadImage function to handle file uploads
        fileUrl = await uploadImage(fileList[0].originFileObj as File);
      } catch (error) {
        AntMessage.error('Failed to upload image');
        console.error('Upload image error:', error);
        return;
      }
    }

    try {
      const messageContent = inputValue.trim();
      const tempId = `temp-id-${Date.now()}`; // Temporary unique ID

      if (chatType === 'group') {
        const messageData = { groupId: chatId, content: messageContent, fileUrl };
        await sendGroupMessage(messageData).unwrap();

        const optimisticMessage: IGroupMessage = {
          _id: tempId,
          content: messageContent,
          sender: {
            _id: userId,
            name: user?.name || 'You',
            email: user?.email || '',
            profile_picture_url: user?.profile_picture_url || '',
            role: user?.role || 'user',
          },
          groupId: chatId,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fileUrl,
          read: false, // Initialize as false
          reactions: [], // Initialize as empty array
        };

        dispatch(addGroupMessage(optimisticMessage));
        // socket?.emit('group_message', optimisticMessage);
      } 
      
      else if (chatType === 'user') {
        const messageData = { receiver: chatId, content: messageContent, fileUrl };
        await sendPrivateMessage(messageData).unwrap();

        const optimisticMessage: IMessage = {
          _id: tempId, // Temporary unique ID
          content: messageContent,
          sender: userId,
          receiver: chatId,
          timestamp: new Date().toISOString(),
          read: false,
          readBy: [], // Initialize as empty array
          reactions: [], // Initialize as empty array
          edited: false, // Initialize as false
          fileUrl, // Optional, can be undefined or a valid string
        };
        
        dispatch(addMessage(optimisticMessage));
        //socket?.emit('private_message', optimisticMessage);
      }

      AntMessage.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      AntMessage.error('Failed to send message.');
    }

    setInputValue('');
    setFileList([]);
    setShowEmojiPicker(false);
  };

  // Handle pagination change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      fileList.forEach((file) => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [fileList]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Sidebar */}
      <Sidebar onCreateGroup={() => setShowCreateGroupModal(true)} className="lg:w-1/4" />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        {/* Chat Header */}
        <div className="rounded-md shadow-lg bg-gradient-to-r from-green-300 via-slate-700 to-green-200 p-4 mb-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center">
            {chatType === 'user' && participantName ? (
              <>
                Chat with{' '}
                <span className="text-yellow-300">
                  {participantName}
                </span>
              </>
            ) : chatType === 'group' && chatId ? (
              <>
                Group Chat:{' '}
                <span className="text-green-300">
                  {groupDetails?.name || 'Loading...'}
                </span>
              </>
            ) : (
              <span className="text-gray-300 italic">Select a User or Group</span>
            )}
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          {chatType === 'user' && chatId ? (
            <PrivateChatArea
              messages={messages}
              userId={userId}
              participantId={chatId}
              isTyping={isTyping}
              typingUserName={participantName || 'User'}
              typingUserAvatar="" // If you have participant's avatar URL, pass it here
            />
          ) : chatType === 'group' && chatId ? (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Group Details */}
              <GroupDetails
                groupId={chatId}
                removeMember={removeMember}
                userId={userId}
                className="lg:w-1/2 lg:h-auto"
              />
              {/* Group Chat Area */}
              <GroupChatArea
                groupId={chatId}
                messages={groupMessages[chatId] || []}
                userId={userId}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-400 dark:border-gray-700"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 h-full italic">
              Select a user or group to start chatting.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {(chatType === 'user' && participantId) || (chatType === 'group' && chatId) ? (
          <div className="relative flex flex-col sm:flex-row max-w-6xl items-center gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
            {showEmojiPicker && (
              <div className="absolute bottom-16 sm:bottom-auto sm:top-16 z-10 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            <Button
              shape="circle"
              icon={<SmileOutlined />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:scale-110 transition-transform bg-yellow-100 text-yellow-600 dark:bg-yellow-700 dark:text-white"
              aria-label="Toggle Emoji Picker"
            />
            <Upload
              beforeUpload={handleBeforeUpload}
              multiple={false}
              onRemove={handleRemove}
              fileList={fileList}
              listType="picture"
              className="hover:scale-110 transition-transform"
              aria-label="Upload Attachment"
            >
              <Button shape="circle" icon={<UploadOutlined />} aria-label="Upload File" />
            </Upload>
            <Input.TextArea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleTyping();
              }}
              onPressEnter={(e) => {
                e.preventDefault(); // Prevent adding a newline on Enter
                sendMessage(); // Send the message when Enter is pressed
              }}
              rows={2}
              placeholder="Type a message..."
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 resize-none shadow-inner"
              aria-label="Message Input"
            />
            <Button
              type="primary"
              htmlType="button" // Explicitly set to 'button' to prevent form submission
              onClick={sendMessage}
              className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              aria-label="Send Message"
            >
              Send
            </Button>
          </div>
        ) : null}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        open={showCreateGroupModal} // Pass the open prop
        onClose={() => setShowCreateGroupModal(false)}
      />
    </div>
  );
};

export default Chat;
