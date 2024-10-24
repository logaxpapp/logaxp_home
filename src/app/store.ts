// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '../store/slices/exampleSlice';
import userReducer from '../store/slices/userSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    user: userReducer,
    theme: themeReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
