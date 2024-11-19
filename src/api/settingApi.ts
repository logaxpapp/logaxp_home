import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISetting } from '../types/setting';
import { ISettingHistory } from '../types/settingHistory';
import { SETTINGS_API } from './endpoints';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action
import type { RootState } from '../app/store'; // Import RootState

export const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include credentials
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken); // Add CSRF token if available
        }
        return headers;
      },
    });

    const result = await base(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['Settings'],
  endpoints: (builder) => ({

    getSettings: builder.query<ISetting[], void>({
        query: () => 'settings',
        providesTags: ['Settings'],
      }),
      updateSetting: builder.mutation<ISetting, Partial<ISetting>>({
        query: (body) => ({
          url: 'settings',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Settings'],
      }),
      deleteSetting: builder.mutation<{ message: string }, string>({
        query: (key) => ({
          url: `settings/${key}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Settings'],
      }),
      getSettingHistory: builder.query<ISettingHistory[], string>({
        query: (key) => `settings/${key}/history`,
      }),
      revertSetting: builder.mutation<ISetting, { key: string; version: number }>({
        query: ({ key, version }) => ({
          url: `settings/${key}/revert`,
          method: 'POST',
          body: { version },
        }),
        invalidatesTags: ['Settings'],
      }),
    }),
  });
  
  export const {
    useGetSettingsQuery,
    useUpdateSettingMutation,
    useDeleteSettingMutation,
    useGetSettingHistoryQuery,
    useRevertSettingMutation,
  } = settingApi;