// src/store/slices/groupMessageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGroupMessage } from '../../types/groupMessage';

interface GroupMessageState {
  messages: Record<string, IGroupMessage[]>;
  typingUsers: Record<string, string[]>;
}

const initialState: GroupMessageState = {
  messages: {},
  typingUsers: {},
};

const groupMessageSlice = createSlice({
  name: 'groupMessage',
  initialState,
  reducers: {
    addGroupMessage(state, action: PayloadAction<IGroupMessage>) {
      const { groupId } = action.payload;

      if (!state.messages[groupId]) {
        state.messages[groupId] = [];
      }

      const exists = state.messages[groupId].some(
        (msg) => msg._id === action.payload._id
      );

      if (!exists) {
        state.messages[groupId].push(action.payload);
      }
    },
    setGroupMessages(
      state,
      action: PayloadAction<{ groupId: string; messages: IGroupMessage[] }>
    ) {
      state.messages[action.payload.groupId] = action.payload.messages;
    },
    setGroupTyping(
      state,
      action: PayloadAction<{ groupId: string; userId: string }>
    ) {
      const { groupId, userId } = action.payload;
      if (!state.typingUsers[groupId]) {
        state.typingUsers[groupId] = [];
      }
      if (!state.typingUsers[groupId].includes(userId)) {
        state.typingUsers[groupId].push(userId);
      }
    },
    clearGroupTyping(
      state,
      action: PayloadAction<{ groupId: string; userId: string }>
    ) {
      const { groupId, userId } = action.payload;
      if (state.typingUsers[groupId]) {
        state.typingUsers[groupId] = state.typingUsers[groupId].filter(
          (id) => id !== userId
        );
      }
    },
  },
});

export const { addGroupMessage, setGroupMessages, setGroupTyping, clearGroupTyping } =
  groupMessageSlice.actions;
export default groupMessageSlice.reducer;
