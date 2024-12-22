// src/api/usersApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../types/user';
import { IGoogleCalendarEvent } from '../types/googleCalendar';
import { setAuthCredentials } from '../store/slices/authSlice';

import {
  USER_API,
  ADMIN_USER_API,
  AUTH_API,
  PROFILE_API,
  PASSWORD_RESET_API,
  GOOGLE_CALENDAR_API,
} from './endpoints';

import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import setSessionExpire

interface LoginResponse {
  user: IUser;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PasswordResetRequest {
  email: string;
}

interface CsrfTokenResponse {
  csrfToken: string;
}

interface CreateUserAndSendInviteInput {
  name: string;
  email: string;
  role?: string;
  password?: string;
}

interface SetupAccountResponse {
  email: string;
  name: string;
}

interface SetupAccountRequest {
  token: string;
  password: string;
}
interface AcknowledgePolicyInput {
  resourceId: string;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: async (args, usersApi, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken); // Set CSRF token
          console.log('CSRF Token attached to headers:', csrfToken); // Debug
        }
        return headers;      
      },
      
    });

    const result = await base(args, usersApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      usersApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: [
    'User',
    'Auth',
    'GoogleCalendarEvent',
    'DeletionRequest',
  ],
  endpoints: (builder) => ({
    
    // Fetch All Users
    fetchAllUsers: builder.query<{ users: IUser[]; total: number }, { page: number; limit: number }>({
      query: ({ page, limit }) => `${USER_API}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    // Fetch user/employee
    fetchEmployees: builder.query<IUser[], void>({
      query: () => `${USER_API}/employees`

    }),
      

    // Create User
    createUser: builder.mutation<IUser, Partial<IUser>>({
      query: (body) => ({
        url: USER_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Create Contractors 
    createContractor: builder.mutation<
    IUser,
    {
      name: string;
      email: string;
      password: string;
      phoneNumber?: string;
      address: { street: string; city: string; state: string; country: string };
    }
  >({
    query: (contractorData) => ({
      url: `${ADMIN_USER_API}/contractors`,
      method: 'POST',
      body: contractorData,
    }),
    invalidatesTags: [{ type: 'User', id: 'LIST' }], // Invalidate the user list cache
  }),
  
    

    // Suspend User
    suspendUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `${ADMIN_USER_API}/${userId}/suspend`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData(
            'fetchAllUsers',
            { page: 1, limit: 10 }, // Ensure you pass `page` and `limit`
            (draft) => {
              const user = draft.users.find((u) => u._id === userId);
              if (user) {
                user.status = 'Suspended'; // Update the user's status in the cache
              }
            }
          )
        );
    
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Revert cache update if the mutation fails
        }
      },
    }),
    
    
    reactivateUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `${ADMIN_USER_API}/${userId}/reactivate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData(
            'fetchAllUsers',
            { page: 1, limit: 10 }, // Ensure you pass `page` and `limit`
            (draft) => {
              const user = draft.users.find((u) => u._id === userId);
              if (user) {
                user.status = 'Active'; // Update the user's status in the cache
              }
            }
          )
        );
    
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Revert cache update if the mutation fails
        }
      },
    }),
    
    
    // Admin: Fetch Deletion Requests
    fetchDeletionRequests: builder.query<any, void>({
      query: () => '/admin/deletion-requests',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: { _id: string }) => ({
                type: 'DeletionRequest' as const,
                id: _id,
              })),
              { type: 'DeletionRequest', id: 'LIST' },
            ]
          : [{ type: 'DeletionRequest', id: 'LIST' }],
    }),

    // Admin: Approve Deletion Request
    approveDeletionRequest: builder.mutation<{ message: string }, string>({
      query: (requestId) => ({
        url: `/admin/deletion-requests/${requestId}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'DeletionRequest', id: 'LIST' }],
    }),

    // Admin: Reject Deletion Request
    rejectDeletionRequest: builder.mutation<{ message: string }, string>({
      query: (requestId) => ({
        url: `/admin/deletion-requests/${requestId}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'DeletionRequest', id: 'LIST' }],
    }),

    // Request Account Deletion
    requestAccountDeletion: builder.mutation<{ message: string }, { reason: string }>({
      query: ({ reason }) => ({
        url: '/profile',
        method: 'DELETE',
        body: { reason },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

     // Bulk Upload Users
     bulkUploadUsers: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `${ADMIN_USER_API}/bulk-create`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Create and Invite User
    createUserAndSendInvite: builder.mutation<IUser, CreateUserAndSendInviteInput>({
      query: (body) => ({
        url: `${ADMIN_USER_API}/invite`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    
     // Fetch setup account data
     fetchSetupAccountData: builder.query<SetupAccountResponse, string>({
      query: (token) => ({
        url: `${AUTH_API}/setup-account`,
        method: 'GET',
        params: { token },
      }),
      providesTags: (result) =>
        result ? [{ type: 'Auth', id: 'SETUP' }] : [{ type: 'Auth', id: 'SETUP' }],
    }),

    getAllLoggedInUsers: builder.query<
      { users: IUser[]; totalUsers: number; currentPage: number; totalPages: number },
      { page: number; limit: number; start?: string; end?: string }
    >({
      query: ({ page, limit, start, end }) => ({
        url: `${AUTH_API}/all-logged-in-users`,
        method: 'GET',
        params: { page, limit, start, end },
      }),
      transformResponse: (response: { users: IUser[]; totalUsers: number; currentPage: number; totalPages: number }) => response,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'Auth' as const, id: _id })),
              { type: 'Auth', id: 'ALL_LOGGED_IN_USERS' },
            ]
          : [{ type: 'Auth', id: 'ALL_LOGGED_IN_USERS' }],
    }),


    // Submit account setup form
    setupAccount: builder.mutation<IUser, SetupAccountRequest>({
      query: ({ token, password }) => ({
        url: `${AUTH_API}/setup-account`,
        method: 'POST',
        body: { token, password },
      }),
      invalidatesTags: (result, error) => [{ type: 'Auth', id: 'SETUP' }],
      async onQueryStarted({ token }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Optionally, refetch the user data or update the state
          dispatch(usersApi.util.invalidateTags([{ type: 'Auth', id: 'SETUP' }]));
        } catch {
          // Handle any errors that occur during the mutation
        }
      },
    }),

    // Edit User API
    editUserProfile: builder.mutation<IUser, { userId: string; updates: Partial<IUser> }>({
      query: ({ userId, updates }) => ({
        url: `${PROFILE_API}/${userId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Optionally, refetch the current user
          dispatch(usersApi.util.invalidateTags([{ type: 'User', id: userId }]));
        } catch {
          // Handle error if needed
        }
      },
    }),

    // Admin Edit User Profile API
    adminEditUserProfile: builder.mutation<IUser, { userId: string; updates: Partial<IUser> }>({
      query: ({ userId, updates }) => ({
        url: `${ADMIN_USER_API}/${userId}/profile`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
      async onQueryStarted({ userId, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData(
            'fetchAllUsers',
            { page: 1, limit: 10 }, // Ensure you pass `page` and `limit`
            (draft) => {
              const user = draft.users.find((u) => u._id === userId);
              if (user) {
                Object.assign(user, updates); // Update user in the cache with provided updates
              }
            }
          )
        );
    
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Revert cache update if the mutation fails
        }
      },
    }),
    
    // Delete User
    deleteUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `${ADMIN_USER_API}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

     // Fetch Calendar Events
     fetchGoogleCalendarEvents: builder.query<IGoogleCalendarEvent[], void>({
      query: () => `${GOOGLE_CALENDAR_API}/calendar/events`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'GoogleCalendarEvent' as const, id })),
              { type: 'GoogleCalendarEvent', id: 'LIST' },
            ]
          : [{ type: 'GoogleCalendarEvent', id: 'LIST' }],
    }),

    // Create Calendar Event
    createGoogleCalendarEvent: builder.mutation<IGoogleCalendarEvent, Partial<IGoogleCalendarEvent>>({
      query: (eventData) => ({
        url: `${GOOGLE_CALENDAR_API}/calendar/events`,
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: [{ type: 'GoogleCalendarEvent', id: 'LIST' }],
    }),

    // Delete Calendar Event
    deleteGoogleCalendarEvent: builder.mutation<{ success: boolean; id: string }, string>({
      query: (eventId) => ({
        url: `${GOOGLE_CALENDAR_API}/calendar/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'GoogleCalendarEvent', id }],
    }),

    initiateGoogleAuth: builder.mutation<{ url: string }, string>({
      query: (userId) => ({
        url: `${GOOGLE_CALENDAR_API}/auth`,
        method: 'POST',
        body: { userId },
      }),
    }),
    // Acknowledge Policy Mutation
    acknowledgePolicy: builder.mutation<
        { user: IUser },
        { resourceId: string; signature: { text: string; font: string; size: string; color: string } }
      >({
        query: ({ resourceId, signature }) => ({
          url: 'profile/acknowledge-policy',
          method: 'POST',
          body: { resourceId, signature },
        }),
        invalidatesTags: [{ type: 'User', id: 'CURRENT_USER' }],
      }),

    
  
     // Disconnect Google Account
     disconnectGoogleAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `${GOOGLE_CALENDAR_API}/disconnect`,
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Optionally, invalidate any cached data related to Google
          dispatch(usersApi.util.invalidateTags(['GoogleCalendarEvent']));
        } catch (error) {
          console.error('Error disconnecting Google account:', error);
        }
      },
    }),


  // Login Mutation
  login: builder.mutation<LoginResponse, LoginRequest>({
    query: (credentials) => ({
      url: `${AUTH_API}/login`,
      method: 'POST',
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    }),
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      try {
        const { data } = await queryFulfilled;
        dispatch(setAuthCredentials({ user: data.user }));
      } catch (error: any) {
        const status = error?.status;
        if (status === 403) {
          console.error("Forbidden: CSRF token invalid or expired.");
        } else if (status === 401) {
          console.error("Unauthorized: Invalid credentials.");
        }
        throw error;
      }
    },
  }),

    // Logout Mutation
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${AUTH_API}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAuthCredentials({ user: null }));
          localStorage.removeItem('user');
        } catch (error) {
          // Handle error if needed
        }
      },
    }),

    adminLogoutUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `${AUTH_API}/admin/logout/${userId}`, // Adjust the endpoint as per your backend
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'Auth', id: userId }],
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: `${AUTH_API}/change-password`,
        method: 'PUT',
        body: data,
      }),
    }),
    
    // Password Reset Mutation
    passwordReset: builder.mutation<void, PasswordResetRequest>({
      query: (data) => ({
        url: `${PASSWORD_RESET_API}/request`,
        method: 'POST',
        body: data,
      }),
    }),

    // src/api/usersApi.ts

      // Add this endpoint in the `endpoints` section
      registerUser: builder.mutation<IUser, { name: string; email: string; password: string }>({
        query: (body) => ({
          url: '/auth/register',
          method: 'POST',
          body,
        }),
      }),


    // CSRF Token Query
    getCsrfToken: builder.query<CsrfTokenResponse, void>({
      query: () => '/csrf-token',
    }),
    }),
});

// Export hooks for usage in functional components
export const {
  // User Hooks
  useFetchAllUsersQuery,
  useFetchEmployeesQuery,
  useCreateUserMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useEditUserProfileMutation,
  useDeleteUserMutation,
  useBulkUploadUsersMutation,
  useCreateUserAndSendInviteMutation,
  useFetchSetupAccountDataQuery,
  useSetupAccountMutation,
  useAdminEditUserProfileMutation,
  useRequestAccountDeletionMutation,
  useFetchDeletionRequestsQuery,
  useApproveDeletionRequestMutation,
  useRejectDeletionRequestMutation,
  useAcknowledgePolicyMutation,

  // Auth Hooks
  useLoginMutation,
  useLogoutMutation,
  useGetCsrfTokenQuery,
  usePasswordResetMutation,
  useGetAllLoggedInUsersQuery,
  useChangePasswordMutation,
  useRegisterUserMutation,
  useAdminLogoutUserMutation,
  
// Google Calendar
  useInitiateGoogleAuthMutation,
  useFetchGoogleCalendarEventsQuery,
  useCreateGoogleCalendarEventMutation,
  useDeleteGoogleCalendarEventMutation,
  useDisconnectGoogleAccountMutation,

  // create Contractors
  useCreateContractorMutation,
} = usersApi;
