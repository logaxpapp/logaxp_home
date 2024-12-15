// src/api/notificationApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { Notification } from '../types/notification';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/notifications`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const csrfToken = (getState() as RootState).csrf.csrfToken;
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNotifications: builder.query<{ data: Notification[] }, void>({
      query: () => '/',
    }),
    markNotificationAsRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: 'PUT',
      }),
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/read',
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
