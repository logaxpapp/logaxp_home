// src/api/changeRequestApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  IChangeRequestApproval,
  ICreateChangeRequestPayload,
  IProcessChangeRequestPayload,
} from '../types/changeRequest';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { CHANGE_REQUEST_API } from './endpoints';

export const changeRequestApi = createApi({
  reducerPath: 'changeRequestApi', // Properly set reducerPath
  baseQuery: async (args, changeRequestApi, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken);
        }
     
        return headers;
      },
    });

    const result = await base(args, changeRequestApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      changeRequestApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['ChangeRequest'],
  endpoints: (builder) => ({
    /**
     * Create a new Change Request
     */
    createChangeRequest: builder.mutation<
      { message: string; data: IChangeRequestApproval },
      ICreateChangeRequestPayload
    >({
      query: (body) => ({
        url: CHANGE_REQUEST_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ChangeRequest', id: 'LIST' }],
    }),

    /**
     * Fetch all Change Requests (Admin Only)
     */
    fetchAllChangeRequests: builder.query<{ data: IChangeRequestApproval[] }, { includeDeleted?: boolean }>({
      query: ({ includeDeleted = false }) => `${CHANGE_REQUEST_API}?includeDeleted=${includeDeleted}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'ChangeRequest' as const, id: _id })),
              { type: 'ChangeRequest', id: 'LIST' },
            ]
          : [{ type: 'ChangeRequest', id: 'LIST' }],
    }),
    
    /**
     * Fetch all Change Requests for the logged-in user
     */
    fetchUserChangeRequests: builder.query<{ data: IChangeRequestApproval[] }, void>({
      query: () => `${CHANGE_REQUEST_API}/my-change-requests`, // Adjust this to match your backend endpoint
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ _id }) => ({ type: 'ChangeRequest' as const, id: _id }))
          : [],
    }),
    softDeleteChangeRequest: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/change-requests/${id}/soft-delete`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: [{ type: 'ChangeRequest', id: 'LIST' }],
    }),
    fetchSoftDeletedChangeRequests: builder.query({
      query: ({ page = 1, limit = 10 }) => `/change-requests/soft-deleted?page=${page}&limit=${limit}`,
      providesTags: [{ type: 'ChangeRequest', id: 'LIST' }],
    }),
    
    permanentlyDeleteChangeRequest: builder.mutation({
      query: (id) => ({
        url: `/change-requests/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ChangeRequest', id: 'LIST' }],
    }),
    restoreChangeRequest: builder.mutation({
      query: (id) => ({
        url: `/change-requests/${id}/restore`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ChangeRequest', id: 'LIST' }],
    }),
    /**
     * Approve a Change Request
     */
    approveChangeRequest: builder.mutation<
      { message: string },
      { id: string; payload: IProcessChangeRequestPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${CHANGE_REQUEST_API}/${id}/approve`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ChangeRequest', id },
        { type: 'ChangeRequest', id: 'LIST' }, // To refresh the list
      ],
    }),

    /**
     * Reject a Change Request
     */
    rejectChangeRequest: builder.mutation<
      { message: string },
      { id: string; payload: IProcessChangeRequestPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${CHANGE_REQUEST_API}/${id}/reject`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ChangeRequest', id },
      ],
    }),

    fetchChangeRequestById: builder.query<IChangeRequestApproval, string>({
      query: (id) => `${CHANGE_REQUEST_API}/${id}`,
      providesTags: (result, error, id) => [{ type: 'ChangeRequest', id }],
    }),
    

    /**
     * Delete a Change Request (Admin Only)
     */
    deleteChangeRequest: builder.mutation<
        { message: string },
        string
      >({
        query: (id) => ({
          url: `${CHANGE_REQUEST_API}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [
          { type: 'ChangeRequest', id },
          { type: 'ChangeRequest', id: 'LIST' },
        ],
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            changeRequestApi.util.updateQueryData(
              'fetchAllChangeRequests',
              { includeDeleted: false }, // Provide a valid default argument
              (draft: { data: IChangeRequestApproval[] }) => {
                if (draft?.data) {
                  draft.data = draft.data.filter((request) => request._id !== id);
                }
              }
            )
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo(); // Undo changes if the query fails
          }
        },
      }),
  }),
});

export const {
  useCreateChangeRequestMutation,
  useFetchAllChangeRequestsQuery,
  useFetchUserChangeRequestsQuery,
  useApproveChangeRequestMutation,
  useRejectChangeRequestMutation,
  useDeleteChangeRequestMutation,
  useRestoreChangeRequestMutation,
  useSoftDeleteChangeRequestMutation,
  useFetchSoftDeletedChangeRequestsQuery,
  usePermanentlyDeleteChangeRequestMutation,
  useFetchChangeRequestByIdQuery,
} = changeRequestApi;
