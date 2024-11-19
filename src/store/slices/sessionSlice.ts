// src/store/slices/sessionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SessionState {
  isSessionExpired: boolean;
}

const initialState: SessionState = {
  isSessionExpired: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionExpired(state, action: PayloadAction<boolean>) {
      state.isSessionExpired = action.payload;
    },
    clearSessionExpired(state) {
      state.isSessionExpired = false;
    },
  },
});

export const { setSessionExpired, clearSessionExpired } = sessionSlice.actions;
export const selectIsSessionExpired = (state: RootState) => state.session.isSessionExpired;
export default sessionSlice.reducer;
