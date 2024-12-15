// src/store/slices/csrfSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface CsrfState {
  csrfToken: string | null;
}

const initialState: CsrfState = {
  csrfToken: null,
};

const csrfSlice = createSlice({
  name: 'csrf',
  initialState,
  reducers: {
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
    clearCsrfToken: (state) => {
      state.csrfToken = null;
    },
  },
});

export const { setCsrfToken, clearCsrfToken } = csrfSlice.actions;
export const selectCsrfToken = (state: RootState) => state.csrf.csrfToken;
export default csrfSlice.reducer;
