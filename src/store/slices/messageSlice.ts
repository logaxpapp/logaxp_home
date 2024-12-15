// src/store/slices/messageSlice.ts

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Reaction {
  user: string; // User ID who reacted
  emoji: string;
}

interface Message {
  _id: string; // Unique identifier for deduplication
  content: string;
  sender: string;
  receiver: string;
  groupId?: string;
  timestamp: string;
  read: boolean;
  readBy: string[]; // Array of user IDs who have read the message
  reactions: Reaction[]; // Array of reactions
  edited: boolean; // Indicates if the message has been edited
  fileUrl?: string;
}

interface MessageState {
  messages: Message[];
  groupMessages: Message[];
}

const initialState: MessageState = {
  messages: [],
  groupMessages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      const exists =
        state.messages.some((msg) => msg._id === action.payload._id) ||
        state.groupMessages.some((msg) => msg._id === action.payload._id);
      if (!exists) {
        if (action.payload.groupId) {
          state.groupMessages.push(action.payload);
        } else {
          state.messages.push(action.payload);
        }
      }
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      // Separate messages and group messages
      const userMessages = action.payload.filter((msg) => !msg.groupId);
      const grpMessages = action.payload.filter((msg) => msg.groupId);

      state.messages = Array.from(
        new Map(userMessages.map((msg) => [msg._id, msg])).values()
      ); // Deduplicate user messages

      state.groupMessages = Array.from(
        new Map(grpMessages.map((msg) => [msg._id, msg])).values()
      ); // Deduplicate group messages
    },

    addReaction(
      state,
      action: PayloadAction<{ messageId: string; userId: string; emoji: string }>
    ) {
      const { messageId, userId, emoji } = action.payload;
      let message = state.messages.find((msg) => msg._id === messageId);
      if (!message) {
        message = state.groupMessages.find((msg) => msg._id === messageId);
      }
      if (message) {
        const existingReaction = message.reactions.find(
          (reaction) => reaction.user === userId && reaction.emoji === emoji
        );
        if (!existingReaction) {
          message.reactions.push({ user: userId, emoji });
        }
      }
    },

    editMessage(
      state,
      action: PayloadAction<{ messageId: string; newContent: string }>
    ) {
      const { messageId, newContent } = action.payload;
      let message = state.messages.find((msg) => msg._id === messageId);
      if (!message) {
        message = state.groupMessages.find((msg) => msg._id === messageId);
      }
      if (message) {
        message.content = newContent;
        message.edited = true;
      }
    },

    deleteMessage(state, action: PayloadAction<string>) {
      const messageId = action.payload;
      state.messages = state.messages.filter((msg) => msg._id !== messageId);
      state.groupMessages = state.groupMessages.filter((msg) => msg._id !== messageId);
    },

    markMessagesAsRead(
      state,
      action: PayloadAction<{ messageId: string; by: string }>
    ) {
      const { messageId, by } = action.payload;
      let message = state.messages.find((msg) => msg._id === messageId);
      if (!message) {
        message = state.groupMessages.find((msg) => msg._id === messageId);
      }
      if (message && !message.readBy.includes(by)) {
        message.readBy.push(by);
        if (!message.read && message.readBy.length === 1) {
          message.read = true;
        }
      }
    },

    updateUserStatus(
      state,
      action: PayloadAction<{ userId: string; onlineStatus: string }>
    ) {
      // Implement if needed
    },
  },
});

export const {
  addMessage,
  setMessages,
  addReaction,
  editMessage,
  deleteMessage,
  markMessagesAsRead,
  updateUserStatus,
} = messageSlice.actions;

export default messageSlice.reducer;

// Selector to get count of unread messages
export const selectUnreadCount = createSelector(
  (state: RootState) => state.messages.messages,
  (messages) => messages.filter((msg) => !msg.read).length
);
