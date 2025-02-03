import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import {
  ITestCase,
  CreateTestCasePayload,
  UpdateTestCasePayload,
  AssignTestCasePayload,
  AddTestExecutionPayload,
  TestAnalysis,
} from '../types/testCase';

export const testCaseApi = createApi({
  reducerPath: 'testCaseApi',
  baseQuery: customBaseQuery,
  tagTypes: ['TestCase', 'TestAnalysis'], // <--- Add "TestAnalysis"
  endpoints: (builder) => ({
    fetchAllTestCases: builder.query<
      { testCases: ITestCase[]; total: number },
      {
        application?: string;
        environment?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
      } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          if (args.application) params.set('application', args.application);
          if (args.environment) params.set('environment', args.environment);
          if (args.status) params.set('status', args.status);
          if (args.search) params.set('search', args.search);
          if (args.page) params.set('page', String(args.page));
          if (args.limit) params.set('limit', String(args.limit));
          if (args.sortField) params.set('sortField', args.sortField);
          if (args.sortOrder) params.set('sortOrder', args.sortOrder);
        }
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return { url: `/test-cases${queryString}`, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.testCases.map((tc) => ({ type: 'TestCase' as const, id: tc._id })),
              { type: 'TestCase', id: 'LIST' },
            ]
          : [{ type: 'TestCase', id: 'LIST' }],
    }),

    fetchTestCaseById: builder.query<ITestCase, string>({
      query: (id) => `/test-cases/${id}`,
      providesTags: (result, error, id) => [{ type: 'TestCase', id }],
    }),

    createTestCase: builder.mutation<ITestCase, CreateTestCasePayload>({
      query: (body) => ({
        url: '/test-cases',
        method: 'POST',
        body,
      }),
      // Invalidate both the test case list + the analysis
      invalidatesTags: [{ type: 'TestCase', id: 'LIST' }, 'TestAnalysis'],
    }),

    updateTestCase: builder.mutation<ITestCase, { id: string; data: UpdateTestCasePayload }>({
      query: ({ id, data }) => ({
        url: `/test-cases/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'TestCase', id: arg.id }, 'TestAnalysis'],
    }),

    deleteTestCase: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/test-cases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'TestCase', id },
        { type: 'TestCase', id: 'LIST' },
        'TestAnalysis',
      ],
    }),

    assignTestCase: builder.mutation<ITestCase, { id: string; payload: AssignTestCasePayload }>({
      query: ({ id, payload }) => ({
        url: `/test-cases/${id}/assign`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'TestCase', id: arg.id }, 'TestAnalysis'],
    }),

    addTestExecution: builder.mutation<ITestCase, { id: string; execution: AddTestExecutionPayload }>({
      query: ({ id, execution }) => ({
        url: `/test-cases/${id}/executions`,
        method: 'POST',
        body: execution,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'TestCase', id: arg.id }, 'TestAnalysis'],
    }),

    fetchApplications: builder.query<{ applications: string[] }, void>({
      query: () => '/test-cases/applications',
      // optional if you want re-fetch logic here
    }),

    uploadTestCaseAttachment: builder.mutation<ITestCase, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('attachment', file);
        return { url: `/test-cases/${id}/attachments`, method: 'POST', body: formData };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'TestCase', id: arg.id }, 'TestAnalysis'],
    }),

    deleteTestCaseAttachment: builder.mutation<ITestCase, { testCaseId: string; attachmentId: string }>({
      query: ({ testCaseId, attachmentId }) => ({
        url: `/test-cases/${testCaseId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'TestCase', id: arg.testCaseId },
        'TestAnalysis',
      ],
    }),

    linkRequirement: builder.mutation<any, { testCaseId: string; requirementId: string }>({
      query: ({ testCaseId, requirementId }) => ({
        url: `/test-cases/${testCaseId}/link-requirement`,
        method: 'POST',
        body: { requirementId },
      }),
      invalidatesTags: (result, error, { testCaseId }) => [
        { type: 'TestCase', id: testCaseId },
        { type: 'TestCase', id: 'LIST' },
      ],
    }),
    unlinkRequirement: builder.mutation<any, { testCaseId: string; requirementId: string }>({
      query: ({ testCaseId, requirementId }) => ({
        url: `/test-cases/${testCaseId}/unlink-requirement`,
        method: 'POST',
        body: { requirementId },
      }),
      invalidatesTags: (result, error, { testCaseId }) => [
        { type: 'TestCase', id: testCaseId },
      ],
    }),

    // Analysis endpoint
    fetchTestAnalysis: builder.query<TestAnalysis, void>({
      query: () => '/test-cases/analysis',
      providesTags: (result) => result ? ['TestAnalysis'] : [],
    }),
  }),
});

export const {
  useFetchAllTestCasesQuery,
  useFetchTestCaseByIdQuery,
  useCreateTestCaseMutation,
  useUpdateTestCaseMutation,
  useDeleteTestCaseMutation,
  useAssignTestCaseMutation,
  useAddTestExecutionMutation,
  useFetchApplicationsQuery,
  useUploadTestCaseAttachmentMutation,
  useDeleteTestCaseAttachmentMutation,
  useFetchTestAnalysisQuery,

  useLinkRequirementMutation,
  useUnlinkRequirementMutation,
} = testCaseApi;
