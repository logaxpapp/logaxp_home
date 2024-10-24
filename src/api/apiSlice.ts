// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../types/user';
import {
  USER_API,
  DELETION_REQUEST_API,
  AUTH_API,
  PASSWORD_RESET_API,
} from './endpoints';

interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  // Add other fields as needed
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PasswordResetRequest {
  email: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  tagTypes: ['User', 'DeletionRequest', 'Auth'],
  endpoints: (builder) => ({
    fetchAllUsers: builder.query<{ users: IUser[]; total: number }, void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation<IUser, Partial<IUser>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    suspendUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `${USER_API}/${userId}/suspend`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        // Optimistically update the user in the cache
        const patchResult = dispatch(
          api.util.updateQueryData('fetchAllUsers', undefined, (draft) => {
            const user = draft.users.find((u) => u._id === userId);
            if (user) {
              user.role = 'Suspended'; // Or any other relevant field
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Revert if the mutation fails
        }
      },
    }),
    reactivateUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `/users/${userId}/reactivate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    editUserProfile: builder.mutation<IUser, { userId: string; updates: Partial<IUser> }>({
      query: ({ userId, updates }) => ({
        url: `/users/${userId}/profile`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
     // Login Mutation
     login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: `${AUTH_API}/login`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Password Reset Mutation
    passwordReset: builder.mutation<void, PasswordResetRequest>({
      query: (data) => ({
        url: `${PASSWORD_RESET_API}/request`,
        method: 'POST',
        body: data,
      }),
    }),

    // Add other endpoints as needed
  }),
});

export const {
  useFetchAllUsersQuery,
  useCreateUserMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useEditUserProfileMutation,
  useLoginMutation, // Export the login hook
  usePasswordResetMutation, // Export the password reset hook
} = api;