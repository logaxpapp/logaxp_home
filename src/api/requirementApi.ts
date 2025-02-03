// "I want the vital message at all time."
// src/api/requirementApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import { IRequirement } from '../types/requirement';

export const requirementApi = createApi({
  reducerPath: 'requirementApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Requirement', 'TestCase'],
  endpoints: (builder) => ({
    // Provide an optional application param
    fetchAllRequirements: builder.query<
      { requirements: IRequirement[] },
      { application?: string } | void
    >({
      query: (arg) => {
        // If an application is given, add ?application=someApp
        const app = arg && arg.application ? arg.application : '';
        const queryString = app ? `?application=${encodeURIComponent(app)}` : '';
        return `/requirements${queryString}`;
      },
      providesTags: ['Requirement'],
    }),

    createRequirement: builder.mutation<IRequirement, Partial<IRequirement>>({
      query: (body) => ({
        url: '/requirements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Requirement'],
    }),

    updateRequirement: builder.mutation<
      IRequirement,
      { id: string; data: Partial<IRequirement> }
    >({
      query: ({ id, data }) => ({
        url: `/requirements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Requirement'],
    }),

    deleteRequirement: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/requirements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Requirement'],
    }),

    // Link/Unlink requirement to testCase
    linkRequirementToTestCase: builder.mutation<
      any,
      { testCaseId: string; requirementId: string }
    >({
      query: ({ testCaseId, requirementId }) => ({
        url: `/test-cases/${testCaseId}/link-requirement`,
        method: 'POST',
        body: { requirementId },
      }),
      invalidatesTags: ['TestCase'],
    }),
    unlinkRequirementFromTestCase: builder.mutation<
      any,
      { testCaseId: string; requirementId: string }
    >({
      query: ({ testCaseId, requirementId }) => ({
        url: `/test-cases/${testCaseId}/unlink-requirement`,
        method: 'POST',
        body: { requirementId },
      }),
      invalidatesTags: ['TestCase'],
    }),
  }),
});

export const {
  useFetchAllRequirementsQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
  useLinkRequirementToTestCaseMutation,
  useUnlinkRequirementFromTestCaseMutation,
} = requirementApi;

// Vital Message: The 'application' query param ensures we only fetch the relevant Requirements.
