// src/api/baseQuery.ts

import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { Mutex } from 'async-mutex';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create a mutex to prevent multiple simultaneous token refreshes
const mutex = new Mutex();

/**
 * Custom baseQuery with header preparation and error handling.
 */
export const customBaseQuery: BaseQueryFn<string | { url: string; method: string; body?: any }, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  // Wait if the mutex is locked
  await mutex.waitForUnlock();

  const state = api.getState() as RootState;
  const csrfToken = state.csrf.csrfToken;

  // Define the base query
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      return headers;
    },
  });

  // Execute the base query
  const result = await rawBaseQuery(args, api, extraOptions);

  // Handle unauthorized responses
  if (result.error && result.error.status === 401) {
    // Optionally, you can implement token refresh logic here
    // For now, we'll simply set the session as expired
    api.dispatch(setSessionExpired(true));
  }

  return result;
};
