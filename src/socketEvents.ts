import { Socket } from 'socket.io-client';
import { store } from './app/store';
import { addNotification } from './store/slices/notificationSlice';
import {
  addMessage,
  markMessagesAsRead,
  updateUserStatus,
  deleteMessage,
  addReaction,
  editMessage,
} from './store/slices/messageSlice';
import {
  addGroupMessage,
  setGroupTyping,
  clearGroupTyping,
} from './store/slices/groupMessageSlice';

export const setupSocketListeners = (socket: Socket, userId: string) => {
  // Notifications
  socket.on('notification', (notification) => {
    store.dispatch(addNotification(notification));
  });

  // Private Messages
  socket.on('private_message', (message) => {
    const existingMessages = store.getState().messages.messages;
    const exists = existingMessages.some((msg) => msg._id === message._id);
    if (!exists) {
      store.dispatch(addMessage(message));
    }
  });

  // Group Messages
  const seenMessageIds = new Set();
  socket.on('group_message', (message) => {
    if (!seenMessageIds.has(message._id)) {
      seenMessageIds.add(message._id);
      store.dispatch(addGroupMessage(message));
    }
  });

  // Document Shared
  socket.on('document_shared', (data) => {
    console.log('Doc shared:', data);
  });

  // Group Invitations
  socket.on('group_invitation', (data) => {
    console.log(`You have been invited to join group: ${data.groupName}`);
    store.dispatch(
      addNotification({
        title: 'Group Invitation',
        message: `You have been invited to join group: ${data.groupName}`,
        type: 'group_invitation',
        recipient: userId,
      })
    );
  });

  // Message Edited
  socket.on('message_edited', (data) => {
    const { messageId, newContent } = data;
    store.dispatch(
      editMessage({
        messageId,
        newContent,
      })
    );
  });

  // Reaction Added
  socket.on('reaction_added', (data) => {
    const { messageId, userId: reactorId, emoji } = data;
    store.dispatch(
      addReaction({
        messageId,
        userId: reactorId,
        emoji,
      })
    );
  });

  // Message Deleted
  socket.on('message_deleted', (data) => {
    const { messageId } = data;
    store.dispatch(deleteMessage(messageId));
  });

  // User Status Update
  socket.on('user_status_update', (data) => {
    const { userId: updatedUserId, onlineStatus } = data;
    console.log(`User ${updatedUserId} is now ${onlineStatus}`);
    store.dispatch(
      updateUserStatus({
        userId: updatedUserId,
        onlineStatus,
      })
    );
  });

  // Typing
  socket.on('typing', (data) => {
    const { from, groupId } = data;
    store.dispatch(setGroupTyping({ groupId, userId: from }));
  });
  socket.on('stop_typing', (data) => {
    const { from, groupId } = data;
    store.dispatch(clearGroupTyping({ groupId, userId: from }));
  });

  // Messages Read
  socket.on('messages_read', (data) => {
    const { messageId, by } = data;
    store.dispatch(
      markMessagesAsRead({
        messageId,
        by,
      })
    );
  });



  socket.on('whiteboard_update', (payload) => {
    const { strokes, version } = payload;
    console.log('Received whiteboard_update:', strokes, version);
    // Update your local state or Redux
  });
  

  socket.on('whiteboard_conflict', (payload) => {
    const { serverVersion, serverStrokes } = payload;
    console.warn('Whiteboard conflict!', serverVersion, serverStrokes);
    // handle conflict
  });

  socket.on('whiteboard_cursor_move', (data) => {
    const { userId, x, y } = data;
    console.log(`Cursor from user ${userId} at ${x}, ${y}`);
    // Update your local UI to show their cursor
  });  
};
