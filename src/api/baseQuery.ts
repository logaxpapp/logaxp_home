// src/api/baseQuery.ts

import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { Mutex } from 'async-mutex';
import { showGlobalToast } from '../features/Toast/globalToast'; // <--- import here

const BASE_URL = import.meta.env.VITE_BASE_URL;
const mutex = new Mutex();

export const customBaseQuery: BaseQueryFn<
  string | { url: string; method: string; body?: any },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
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

  // Execute
  const result = await rawBaseQuery(args, api, extraOptions);

  // Check for 401 => session expired
  if (result.error && result.error.status === 401) {
    showGlobalToast('Your session has expired or is unauthorized.', 'error');
    api.dispatch(setSessionExpired(true));
  }
  // Check for 403 => user not allowed
  else if (result.error && result.error.status === 403) {
    showGlobalToast('You do not have permission to access this resource.', 'error');
  }
  // ...and optionally check other statuses if you want:
  else if (result.error && typeof result.error.status === 'number') {
    showGlobalToast(`Error ${result.error.status}: ${JSON.stringify(result.error.data)}`, 'error');
  }

  return result;
};
