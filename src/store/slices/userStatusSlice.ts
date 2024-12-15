import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnlineStatus } from '../../types/enums';

interface UserStatusState {
  [userId: string]: OnlineStatus;
}

const initialState: UserStatusState = {};

const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState,
  reducers: {
    updateUserStatus(state, action: PayloadAction<{ userId: string; onlineStatus: string }>) {
      state[action.payload.userId] = action.payload.onlineStatus as OnlineStatus;
    },
  },
});

export const { updateUserStatus } = userStatusSlice.actions;
export default userStatusSlice.reducer;
