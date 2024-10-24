// src/features/theme/themeSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
}

const getInitialTheme = (): ThemeState => {
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (storedTheme) {
    return { mode: storedTheme };
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { mode: prefersDark ? 'dark' : 'light' };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
    setTheme(state, action: { type: string; payload: 'light' | 'dark' }) {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
