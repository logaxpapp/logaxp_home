// src/api/usersApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../types/user';
import { UserStatus } from '../types/user';
import { ITeam } from '../types/team';
import { ISubContractor } from '../types/subContractor';
import { IGoogleCalendarEvent } from '../types/googleCalendar';
import { setAuthCredentials } from '../store/slices/authSlice';
import { customBaseQuery } from './baseQuery';

import {
  USER_API,
  ADMIN_USER_API,
  AUTH_API,
  PROFILE_API,
  PASSWORD_RESET_API,
  GOOGLE_CALENDAR_API,
} from './endpoints';

import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; 

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

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// You may want a `MessageResponse` type if your server returns a { message: string }
interface MessageResponse {
  message: string;
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

// Define other necessary interfaces
interface CreateTeamInput {
  name: string;
  description?: string;
}

interface UpdateTeamInput {
  id: string;
  updates: Partial<ITeam>;
}

interface AddMemberInput {
  teamId: string;
  memberId: string;
}

interface RemoveMemberInput {
  teamId: string;
  memberId: string;
}

interface CreateSubContractorInput {
  name: string;
  email: string;
  password_hash: string;
  // ... other necessary fields
}

interface UpdateSubContractorInput {
  id: string;
  updates: Partial<ISubContractor>;
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
    'SubContractor',
    'Team', 
    
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

    fetchUserById: builder.query<IUser, string>({
      query: (id) => `/users/details/${id}`, // Updated endpoint
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
     /**
     * Update User
     */
     updateUser: builder.mutation<IUser, Partial<IUser> & Pick<IUser, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `/users/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'User', id: _id }],
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
                user.status = UserStatus.Suspended;
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
                user.status = UserStatus.Active;
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
        url: `/change-password`,
        method: 'PUT',
        body: data,
      }),
    }),
    
    // Password Reset Mutation
    passwordReset: builder.mutation<MessageResponse, PasswordResetRequest>({
      query: (data) => ({
        url: `${AUTH_API}/request-password-reset`,
        method: 'POST',
        body: data,
      }),
    }),

    // 2) Perform the actual Reset using Token
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `${AUTH_API}/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),



      // Add this endpoint in the `endpoints` section
      registerUser: builder.mutation<IUser, { name: string; email: string; password: string }>({
        query: (body) => ({
          url: '/auth/register',
          method: 'POST',
          body,
        }),
      }),


       /**
     * Create a Team
     */
    createTeam: builder.mutation<ITeam, CreateTeamInput>({
      query: (data) => ({
        url: `/teams`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }],
    }),

    /**
     * Fetch Team by ID
     */
    fetchTeamById: builder.query<ITeam, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    /**
     * Update Team
     */
    updateTeam: builder.mutation<ITeam, UpdateTeamInput>({
      query: ({ id, updates }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, { type: 'Team', id: 'LIST' }],
    }),

    /**
     * Delete Team
     */
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, { type: 'Team', id: 'LIST' }],
    }),

    /**
     * Add Member to Team
     */
    addMemberToTeam: builder.mutation<ITeam, { teamId: string; memberId: string; role: 'Leader' | 'Member' | 'Viewer' }>({
      query: ({ teamId, memberId, role }) => ({
        url: `/teams/${teamId}/members`,
        method: 'POST',
        body: { memberId, role },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }],
    }),

    /**
     * Remove Member from Team
     */
    removeMemberFromTeam: builder.mutation<ITeam, RemoveMemberInput>({
      query: ({ teamId, memberId }) => ({
        url: `/teams/${teamId}/members`,
        method: 'DELETE',
        body: { memberId },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }, { type: 'Team', id: 'LIST' }],
    }),

    // NEW: SubContractor Endpoints

    /**
     * Create a SubContractor
     */
    createSubContractor: builder.mutation<IUser, CreateSubContractorInput>({
      query: (data) => ({
        url: `/subcontractors`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'SubContractor', id: 'LIST' }],
    }),

    /**
     * Fetch all SubContractors
     */
    fetchSubContractors: builder.query<IUser[], void>({
      query: () => `/subcontractors`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'SubContractor' as const, id: _id })),
              { type: 'SubContractor', id: 'LIST' },
            ]
          : [{ type: 'SubContractor', id: 'LIST' }],
    }),

    /**
     * Fetch SubContractor by ID
     */
    fetchSubContractorById: builder.query<IUser, string>({
      query: (id) => `/subcontractors/${id}`,
      providesTags: (result, error, id) => [{ type: 'SubContractor', id }],
    }),

    /**
     * Update SubContractor
     */
    updateSubContractor: builder.mutation<IUser, UpdateSubContractorInput>({
      query: ({ id, updates }) => ({
        url: `/subcontractors/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SubContractor', id }, { type: 'SubContractor', id: 'LIST' }],
    }),

    /**
     * Delete SubContractor
     */
    deleteSubContractor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subcontractors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'SubContractor', id }, { type: 'SubContractor', id: 'LIST' }],
    }),

     // Fetch Teams with Search, Filter, and Pagination
     fetchTeams: builder.query<{ teams: ITeam[]; total: number; page: number; pages: number }, { search?: string; role?: string; page: number; limit: number }>({
      query: ({ search, role, page, limit }) => ({
        url: '/teams',
        params: { search, role, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.teams.map(({ _id }) => ({ type: 'Team' as const, id: _id })),
              { type: 'Team', id: 'LIST' },
            ]
          : [{ type: 'Team', id: 'LIST' }],
    }),

    

    // Update Member Role
    updateMemberRole: builder.mutation<ITeam, { teamId: string; memberId: string; newRole: 'Leader' | 'Member' | 'Viewer' }>({
      query: ({ teamId, memberId, newRole }) => ({
        url: `/teams/${teamId}/members/role`,
        method: 'PUT',
        body: { memberId, newRole },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }],
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
  useUpdateUserMutation,
  useFetchUserByIdQuery,

  // Auth Hooks
  useLoginMutation,
  useLogoutMutation,
  useGetCsrfTokenQuery,
  usePasswordResetMutation,
  useResetPasswordMutation,
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

   // Team Hooks
  useCreateTeamMutation,
  useFetchTeamsQuery,
  useFetchTeamByIdQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddMemberToTeamMutation,
  useRemoveMemberFromTeamMutation,

  // SubContractor Hooks
  useCreateSubContractorMutation,
  useFetchSubContractorsQuery,
  useFetchSubContractorByIdQuery,
  useUpdateSubContractorMutation,
  useDeleteSubContractorMutation,
  useUpdateMemberRoleMutation,
  
} = usersApi;
