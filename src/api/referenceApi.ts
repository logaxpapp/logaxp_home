// src/api/referenceApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IReferee, GetRefereesParams } from '../types/referee';
import { IReference, ReferenceStatus } from '../types/reference';
import { IPublicReferenceFormData, IPublicReferenceResponse } from '../types/publicReferenceForm';
import { IAuditReferenceResponse } from '../types/auditReference';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';

/**
 * We create an RTK Query API slice that handles both "Referees" and "References."
 */
export const referenceApi = createApi({
  reducerPath: 'referenceApi',

  baseQuery: async (args, api, extraOptions) => {
    // Standard 'fetchBaseQuery' with credentials & CSRF handling
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

    const result = await base(args, api, extraOptions);

    // If we get a 401 (Unauthorized), set session as expired
    if (result.error && result.error.status === 401) {
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },

  tagTypes: ['Referees', 'References'],

  endpoints: (builder) => ({

    /***************************
     * REFEREE ENDPOINTS
     ***************************/

    // 1) Get Referees (with optional search & pagination, no status)
    getReferees: builder.query<{ referees: IReferee[]; total: number }, GetRefereesParams>({
      query: ({ search = '', page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        return `referees?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.referees.map(({ _id }) => ({ type: 'Referees' as const, id: _id })),
              { type: 'Referees', id: 'LIST' },
            ]
          : [{ type: 'Referees', id: 'LIST' }],
    }),

    // 2) Get a single referee by ID
    getReferee: builder.query<IReferee, string>({
      query: (id) => `referees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Referees', id }],
    }),

    // 3) Add a new referee
    //    We'll send all fields required by the IReferee interface
    addReferee: builder.mutation<IReferee, Partial<IReferee>>({
      query: (body) => ({
        url: 'referees',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Referees', id: 'LIST' }],
    }),

    // 4) Update a referee
    updateReferee: builder.mutation<IReferee, { id: string; updates: Partial<IReferee> }>({
      query: ({ id, updates }) => ({
        url: `referees/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Referees', id }],
    }),

    // 5) Delete a referee
    deleteReferee: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `referees/${id}`,
        method: 'DELETE',
      }),
      // Example of optimistic cache update (optional)
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          referenceApi.util.updateQueryData('getReferees', { page: 1, limit: 10 }, (draft) => {
            // Remove the deleted referee from the existing 'draft'
            draft.referees = draft.referees.filter((referee) => referee._id !== id);
            draft.total -= 1;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Referees', id },
        { type: 'Referees', id: 'LIST' },
      ],
    }),

    /***************************
     * REFERENCE ENDPOINTS
     ***************************/

    // 1) Create a new reference
    //    We pass partial IReference, but note we specifically need fields
    //    that match the createReference call: relationship, positionHeld, etc.
    createReference: builder.mutation<IReference, Partial<IReference>>({
      query: (body) => ({
        url: 'references',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'References', id: 'LIST' }],
    }),

    // 2) Get a reference by ID
    getReference: builder.query<IReference, string>({
      query: (id) => `references/${id}`,
      providesTags: (result, error, id) => [{ type: 'References', id }],
    }),

    // 3) Update a reference
    updateReference: builder.mutation<IReference, { id: string; updates: Partial<IReference> }>({
      query: ({ id, updates }) => ({
        url: `references/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'References', id }],
    }),

    // 4) Delete a reference
    deleteReference: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `references/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'References', id },
        { type: 'References', id: 'LIST' },
      ],
    }),

    // 5) Send a reference (transition from Pending -> Sent)
    sendReference: builder.mutation<IReference, string>({
      query: (id) => ({
        url: `references/${id}/send`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'References', id }],
    }),

    // 6) Receive a reference (transition from Sent -> Received)
    receiveReference: builder.mutation<IReference, string>({
      query: (id) => ({
        url: `references/${id}/receive`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'References', id }],
    }),

    // 7) Complete a reference (transition from Received -> Completed)
    completeReference: builder.mutation<IReference, string>({
      query: (id) => ({
        url: `references/${id}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'References', id }],
    }),

    // 8) Reject a reference (transition from Sent -> Rejected)
    rejectReference: builder.mutation<IReference, { id: string; rejectionReason: string }>({
      query: ({ id, rejectionReason }) => ({
        url: `references/${id}/reject`,
        method: 'POST',
        body: { rejectionReason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'References', id }],
    }),

    // 9) List references with filters and pagination
    listReferences: builder.query<
      { references: IReference[]; total: number },
      Partial<{
        applicantId: string;
        refereeId: string;
        status: ReferenceStatus;
        search: string;
        page: number;
        limit: number;
      }>
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.applicantId) queryParams.append('applicantId', params.applicantId);
        if (params.refereeId) queryParams.append('refereeId', params.refereeId);
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        return `references?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.references.map(({ _id }) => ({ type: 'References' as const, id: _id })),
              { type: 'References', id: 'LIST' },
            ]
          : [{ type: 'References', id: 'LIST' }],
    }),

        // 10) Get the Reference Form (public)
        getReferenceForm: builder.query<IPublicReferenceResponse, string>({
          query: (token) => `references/form?token=${token}`,
          providesTags: ['References'],
        }),

    // 11) Submit the Reference Form (public)
    //     Typically, the form includes performance, conduct, integrity,
    //     plus the refereeSignature (base64 or typed).
    submitReferenceForm: builder.mutation<{ message: string }, Partial<IReference>>({
      query: (body) => ({
        url: 'references/form',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['References'],
    }),
  // 12) Get auditReference `references/${referenceId}/audit`
  getAuditReference: builder.query<IAuditReferenceResponse, string>({
    query: (referenceId) => `references/${referenceId}/audit`,
    providesTags: (result, error, id) => [{ type: 'References', id }],
  }),
  }),
});

// Export the generated RTK Query hooks
export const {
  // Referee Hooks
  useGetRefereesQuery,
  useGetRefereeQuery,
  useAddRefereeMutation,
  useUpdateRefereeMutation,
  useDeleteRefereeMutation,

  // Reference Hooks
  useCreateReferenceMutation,
  useGetReferenceQuery,
  useUpdateReferenceMutation,
  useDeleteReferenceMutation,
  useSendReferenceMutation,
  useReceiveReferenceMutation,
  useCompleteReferenceMutation,
  useRejectReferenceMutation,
  useListReferencesQuery,
  useGetReferenceFormQuery,
  useSubmitReferenceFormMutation,

  useGetAuditReferenceQuery,
} = referenceApi;
