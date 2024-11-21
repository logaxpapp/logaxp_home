// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAppraisalMetric } from '../types/AppraisalMetric';
import { APPRAISAL_METRIC_API, } from './endpoints';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import setSessionExpire


interface CsrfTokenResponse {
  csrfToken: string;
}


export const appraisalMetricApi = createApi({
  reducerPath: 'appraisalMetricApi',
  baseQuery: async (args, appraisalMetricApi, extraOptions) => {
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

    const result = await base(args, appraisalMetricApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      appraisalMetricApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['AppraisalMetric'],
  endpoints: (builder) => ({
    


    /**
     * Fetch All Appraisal Metrics
     */
    fetchAppraisalMetrics: builder.query<IAppraisalMetric[], void>({
      query: () => APPRAISAL_METRIC_API,
      transformResponse: (response: { data: IAppraisalMetric[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'AppraisalMetric' as const, id: _id })),
              { type: 'AppraisalMetric', id: 'LIST' },
            ]
          : [{ type: 'AppraisalMetric', id: 'LIST' }],
    }),

    /**
     * Fetch Appraisal Metric by ID
     */
    fetchAppraisalMetricById: builder.query<IAppraisalMetric, string>({
      query: (id) => `${APPRAISAL_METRIC_API}/${id}`,
      transformResponse: (response: { data: IAppraisalMetric }) => response.data,
      providesTags: (result, error, id) => [{ type: 'AppraisalMetric', id }],
    }),

    /**
     * Create a New Appraisal Metric
     */
    createAppraisalMetric: builder.mutation<IAppraisalMetric, Partial<IAppraisalMetric>>({
      query: (body) => ({
        url: APPRAISAL_METRIC_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AppraisalMetric', id: 'LIST' }],
    }),

    /**
     * Update an Existing Appraisal Metric
     */
    updateAppraisalMetric: builder.mutation<IAppraisalMetric, { id: string; updates: Partial<IAppraisalMetric> }>({
      query: ({ id, updates }) => ({
        url: `${APPRAISAL_METRIC_API}/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AppraisalMetric', id }],
    }),

    /**
     * Delete an Appraisal Metric
     */
    deleteAppraisalMetric: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${APPRAISAL_METRIC_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AppraisalMetric', id },
        { type: 'AppraisalMetric', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks
export const {
  useFetchAppraisalMetricsQuery,
  useFetchAppraisalMetricByIdQuery,
  useCreateAppraisalMetricMutation,
  useUpdateAppraisalMetricMutation,
  useDeleteAppraisalMetricMutation,
} = appraisalMetricApi;
