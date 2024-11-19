// src/store/slices/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface UserState {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
  token: string | null; // Manage authentication token
}

const initialState: UserState = {
  name: '',
  email: '',
  role: 'User',
  isAuthenticated: false,
  token: null,
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setUserInfo(
      state,
      action: PayloadAction<{ name: string; email: string; role: string; token: string }>
    ) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.name = '';
      state.email = '';
      state.role = 'User';
      state.isAuthenticated = false;
      state.token = null;
    },
    logoutUser(state) {
      state.name = '';
      state.email = '';
      state.role = 'User';
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setName, setEmail, setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
