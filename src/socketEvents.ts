// src/socketEvents.ts

import { Socket } from 'socket.io-client';
import { store } from './app/store';
import { addNotification } from './store/slices/notificationSlice';
import { addMessage, markMessagesAsRead, updateUserStatus, deleteMessage, addReaction, editMessage } from './store/slices/messageSlice';
import { addGroupMessage, setGroupTyping, clearGroupTyping, } from './store/slices/groupMessageSlice';

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
       seenMessageIds.add(message._id); // Track this message
       store.dispatch(addGroupMessage(message));
     }
   });

   // ducumenyt share 
   socket.on('document_shared', (data) => {
    // Show toast, or open a modal that a doc was shared with me
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

    // Listen for typing in group
  socket.on('typing', (data) => {
    const { from, groupId } = data;
    // Dispatch action to show typing indicator for this group and user
    store.dispatch(setGroupTyping({ groupId, userId: from }));
  });
    
     // Listen for stop typing in group
  socket.on('stop_typing', (data) => {
    const { from, groupId } = data;
    // Dispatch action to remove typing indicator for this group and user
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
 };

 export const setupWhiteboardSocketEvents = (socket: Socket, whiteboardId: string) => {
  // 1) Join the room
  socket.emit('join_whiteboard', { whiteboardId });

  // 2) Listen for server updates
  socket.on('whiteboard_update', (payload) => {
    const { strokes, version } = payload;
    console.log('Received whiteboard_update:', strokes, version);
    // store.dispatch(setWhiteboardData({ strokes, version }));
  });

  // 3) Conflict event
  socket.on('whiteboard_conflict', (payload) => {
    const { serverVersion, serverStrokes } = payload;
    console.warn('Whiteboard conflict!', serverVersion);
    // store.dispatch(setWhiteboardConflict({ serverVersion, serverStrokes }));
  });

  // 4) Additional events, e.g. revert
  socket.on('whiteboard_revert_done', (payload) => {
    // ...
  });
};