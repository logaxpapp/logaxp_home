// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IApprovalRequest, IProcessApprovalPayload, IGetUserApprovalRequestsResponse } from '../types/approval';
import { APPROVAL_API, } from './endpoints';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; 

interface CsrfTokenResponse {
  csrfToken: string;
}


export const approvalsApi = createApi({
  reducerPath: 'approvalsApi',
  baseQuery: async (args, approvalsApi, extraOptions) => {
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

    const result = await base(args, approvalsApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      approvalsApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['Approval'],
  endpoints: (builder) => ({

    // CSRF Token Query
    getCsrfToken: builder.query<CsrfTokenResponse, void>({
      query: () => '/csrf-token',
    }),

     // Submit Approval Request
     submitApprovalRequest: builder.mutation<IApprovalRequest, Partial<IApprovalRequest>>({
      query: (body) => ({
        url: `${APPROVAL_API}/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Approval', id: 'LIST' }],
    }),

    // Get User Approval Requests
    getUserApprovalRequests: builder.query<IGetUserApprovalRequestsResponse, void>({
      query: () => `${APPROVAL_API}/my-approvals`,
      transformResponse: (response: { data: IApprovalRequest[]; total: number; page: number; pages: number }) => ({
        data: response.data,
        total: response.total,
        page: response.page,
        pages: response.pages,
      }),
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Approval' as const, id: _id })),
              { type: 'Approval', id: 'LIST' },
            ]
          : [{ type: 'Approval', id: 'LIST' }],
    }),

    // Get Pending Approvals
    getPendingApprovals: builder.query<IApprovalRequest[], void>({
      query: () => `${APPROVAL_API}/pending`,
      transformResponse: (response: { data: IApprovalRequest[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Approval' as const, id: _id })),
              { type: 'Approval', id: 'PENDING_LIST' },
            ]
          : [{ type: 'Approval', id: 'PENDING_LIST' }],
    }),

    // Get All Approval Requests (Admin Only)
    getAllApprovalRequests: builder.query<IApprovalRequest[], void>({
      query: () => `${APPROVAL_API}/all`,
      transformResponse: (response: { data: IApprovalRequest[] }) => response.data,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Approval' as const, id: _id })),
              { type: 'Approval', id: 'ALL_LIST' },
            ]
          : [{ type: 'Approval', id: 'ALL_LIST' }],
    }),


    // Process Approval Request (Approve/Reject/Add Step)
    processApprovalRequest: builder.mutation<IApprovalRequest, IProcessApprovalPayload>({
      query: (payload) => ({
        url: `${APPROVAL_API}/${payload.requestId}/approve`,
        method: 'PATCH',
        body: {
          action: payload.action,
          status: payload.status,
          comments: payload.comments,
          newApproverId: payload.newApproverId,
          stepName: payload.stepName,
        },
      }),
      invalidatesTags: (result, error, { requestId }) => [{ type: 'Approval', id: requestId }],
    }),

    // Delete Approval Request
    deleteApprovalRequest: builder.mutation<{ message: string }, string>({
      query: (requestId) => ({
        url: `${APPROVAL_API}/${requestId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, requestId) => [
        { type: 'Approval', id: requestId },
        { type: 'Approval', id: 'PENDING_LIST' },
        { type: 'Approval', id: 'ALL_LIST' },
      ],
    }),

    getApprovalRequestById: builder.query<IApprovalRequest, string>({
      query: (id) => `${APPROVAL_API}/${id}`,
      transformResponse: (response: { data: IApprovalRequest }) => response.data, // Extract the 'data' property
      providesTags: (result, error, id) => [{ type: 'Approval', id }],
    }),
   
  }),
});
// Export hooks
export const {
  useSubmitApprovalRequestMutation,
  useGetUserApprovalRequestsQuery,
  useGetPendingApprovalsQuery,
  useGetAllApprovalRequestsQuery,
  useProcessApprovalRequestMutation,
  useDeleteApprovalRequestMutation,
  useGetApprovalRequestByIdQuery,
} = approvalsApi;
