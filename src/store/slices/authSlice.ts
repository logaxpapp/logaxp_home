// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types/user'; 
import { RootState } from '../../app/store'; // Adjust the path based on your project structure

interface AuthState {
  user: IUser | null;
}

const userFromStorage = localStorage.getItem('user');

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthCredentials: (
      state,
      action: PayloadAction<{ user: IUser | null }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem('user');
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearUser: (state) => { // **Add this reducer**
      state.user = null;
      localStorage.removeItem('user');
    },
    setGoogleConnected: (state, action: PayloadAction<boolean>) => { // **New reducer**
      if (state.user) {
        state.user.googleConnected = action.payload;
      }
    },
  },
});

export const { setAuthCredentials, logout, clearUser, setGoogleConnected } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
