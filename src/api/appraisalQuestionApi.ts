// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAppraisalQuestion } from '../types/appraisalQuestion';


import {
  APPRAISAL_QUESTION_API, 
} from './endpoints';

import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import setSessionExpire

interface CsrfTokenResponse {
  csrfToken: string;
}


export const appraisalQuestionApi = createApi({
  reducerPath: 'appraisalQuestionApi',
  baseQuery: async (args, api, extraOptions) => {
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

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['AppraisalQuestion' ],
  endpoints: (builder) => ({
    

    // CSRF Token Query
    getCsrfToken: builder.query<CsrfTokenResponse, void>({
      query: () => '/csrf-token',
    }),
    fetchAppraisalQuestions: builder.query<IAppraisalQuestion[], void>({
      query: () => APPRAISAL_QUESTION_API,
      transformResponse: (response: { data: IAppraisalQuestion[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'AppraisalQuestion' as const, id: _id })),
              { type: 'AppraisalQuestion', id: 'LIST' },
            ]
          : [{ type: 'AppraisalQuestion', id: 'LIST' }],
    }),
    
    /**
     * Fetch Appraisal Question by ID
     */
    fetchAppraisalQuestionById: builder.query<IAppraisalQuestion, string>({
      query: (id) => `${APPRAISAL_QUESTION_API}/${id}`,
      transformResponse: (response: { data: IAppraisalQuestion }) => response.data, // Corrected to single object
      providesTags: (result, error, id) => [{ type: 'AppraisalQuestion', id }],
    }),
    
    /**
     * Create a New Appraisal Question
     */
    createAppraisalQuestion: builder.mutation<IAppraisalQuestion, Partial<IAppraisalQuestion>>({
      query: (body) => ({
        url: APPRAISAL_QUESTION_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AppraisalQuestion', id: 'LIST' }],
    }),
    
    /**
     * Update an Existing Appraisal Question
     */
    updateAppraisalQuestion: builder.mutation<IAppraisalQuestion, { id: string; updates: Partial<IAppraisalQuestion> }>({
      query: ({ id, updates }) => ({
        url: `${APPRAISAL_QUESTION_API}/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AppraisalQuestion', id }],
    }),
    
    /**
     * Delete an Appraisal Question
     */
    deleteAppraisalQuestion: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${APPRAISAL_QUESTION_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AppraisalQuestion', id },
        { type: 'AppraisalQuestion', id: 'LIST' },
      ],
    }),
  }),
  
});

// Export hooks
export const {
  useFetchAppraisalQuestionsQuery,
  useFetchAppraisalQuestionByIdQuery,
  useCreateAppraisalQuestionMutation,
  useUpdateAppraisalQuestionMutation,
  useDeleteAppraisalQuestionMutation,
} = appraisalQuestionApi;
