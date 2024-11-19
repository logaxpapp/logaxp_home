import { ISurvey, ISurveyResponse, IResponse, ISurveyAssignment } from '../types/survey';
import { SURVEY_API } from './endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setSessionExpired } from '../store/slices/sessionSlice';
import type { RootState } from '../app/store';

export const surveyApi = createApi({
  reducerPath: 'surveyApi',
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
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['Survey', 'SurveyResponse', 'SurveyAssignment'],
  endpoints: (builder) => ({
    // Admin: Create Survey
    createSurvey: builder.mutation<ISurvey, Partial<ISurvey>>({
      query: (body) => ({
        url: `${SURVEY_API}/admin/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Survey', id: 'LIST' }],
    }),

    // Admin: Assign Survey
    assignSurvey: builder.mutation<void, { surveyId: string; userIds: string[]; dueDate?: string }>({
      query: ({ surveyId, userIds, dueDate }) => ({
        url: `${SURVEY_API}/admin/${surveyId}/assign`,
        method: 'POST',
        body: { userIds, dueDate },
      }),
      invalidatesTags: [{ type: 'Survey', id: 'LIST' }, { type: 'SurveyAssignment', id: 'LIST' }],
    }),

    // User: Get Surveys
    getUserSurveys: builder.query<{ surveys: ISurvey[]; total: number }, { status?: 'Pending' | 'Completed' }>({
      query: ({ status }) => ({
        url: `${SURVEY_API}/user/surveys`,
        method: 'GET',
        params: { status },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.surveys.map(({ _id }) => ({ type: 'Survey' as const, id: _id })),
              { type: 'Survey', id: 'LIST' },
            ]
          : [{ type: 'Survey', id: 'LIST' }],
    }),

    // User: Submit Survey Responses
    submitSurveyResponses: builder.mutation<ISurveyResponse, { assignmentId: string; responses: IResponse[] }>({
      query: ({ assignmentId, responses }) => ({
        url: `${SURVEY_API}/${assignmentId}/responses`,
        method: 'POST',
        body: { responses },
      }),
      invalidatesTags: (result, error, { assignmentId }) => [{ type: 'Survey', id: assignmentId }],
    }),

    // User: Get Survey Responses (Paginated)
    getUserSurveyResponses: builder.query<
      { responses: ISurveyResponse[]; total: number; pages: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `${SURVEY_API}/user/responses`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? result.responses.map(({ _id }) => ({ type: 'SurveyResponse', id: _id }))
          : [{ type: 'SurveyResponse', id: 'USER_RESPONSES' }],
    }),

    // Admin: Get Survey Responses by Survey ID
    getSurveyResponses: builder.query<ISurveyResponse[], string>({
      query: (surveyId) => `${SURVEY_API}/${surveyId}/responses`,
      providesTags: (result, error, surveyId) =>
        result
          ? result.map(({ _id }) => ({ type: 'SurveyResponse', id: _id }))
          : [{ type: 'SurveyResponse', id: `LIST-${surveyId}` }],
    }),

    // Admin: Get All Survey Responses
    // RTK Query: Get all survey responses (paginated)
      getAllSurveyResponses: builder.query<
      { responses: ISurveyResponse[]; total: number; pages: number },
      { page: number; limit: number }
      >({
      query: ({ page, limit }) => ({
        url: `${SURVEY_API}/admin/responses`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? result.responses.map(({ _id }) => ({ type: 'SurveyResponse', id: _id }))
          : [{ type: 'SurveyResponse', id: 'ALL_RESPONSES' }],
      }),

    // Get Survey Assignment by Assignment ID
    getSurveyAssignment: builder.query<ISurveyAssignment, string>({
      query: (assignmentId) => `${SURVEY_API}/surveys/${assignmentId}`,
      providesTags: (result, error, assignmentId) => [{ type: 'SurveyAssignment', id: assignmentId }],
    }),

    // Admin: Get Survey Details
    getSurveyDetails: builder.query<ISurvey, string>({
      query: (surveyId) => `${SURVEY_API}/surveys/${surveyId}`,
      providesTags: (result, error, surveyId) => [{ type: 'Survey', id: surveyId }],
    }),

    // Admin: Get Survey Assignments
    getSurveyAssignments: builder.query<ISurveyAssignment[], string>({
      query: (surveyId) => `${SURVEY_API}/${surveyId}/assignments`,
      providesTags: (result, error, surveyId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'SurveyAssignment' as const, id: _id })),
              { type: 'SurveyAssignment' as const, id: `LIST-${surveyId}` },
            ]
          : [{ type: 'SurveyAssignment' as const, id: `LIST-${surveyId}` }],
    }),

    // Admin: Update Survey
    updateSurvey: builder.mutation<ISurvey, { surveyId: string; updates: Partial<ISurvey> }>({
      query: ({ surveyId, updates }) => ({
        url: `${SURVEY_API}/admin/${surveyId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { surveyId }) => [{ type: 'Survey', id: surveyId }],
    }),

    // Admin: Delete Survey
    deleteSurvey: builder.mutation<{ message: string }, string>({
      query: (surveyId) => ({
        url: `${SURVEY_API}/admin/${surveyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, surveyId) => [{ type: 'Survey', id: surveyId }, { type: 'Survey', id: 'LIST' }],
    }),

    // Admin: Get All Surveys
    getAllSurveys: builder.query<ISurvey[], void>({
      query: () => `${SURVEY_API}/admin/surveys`,
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Survey' as const, id: _id }))
          : [{ type: 'Survey', id: 'LIST' }],
    }),

  // Get User Survey Responses by ID or Email
  getUserSurveyResponsesByIdOrEmail: builder.query<ISurveyResponse[], string>({
    query: (surveyId) => ({
      url: `${SURVEY_API}/user/responses/${surveyId}`,
      method: 'GET',
    }),
    providesTags: (result, error, surveyId) =>
      result
        ? result.map(({ _id }) => ({ type: 'SurveyResponse' as const, id: _id }))
        : [{ type: 'SurveyResponse', id: surveyId }],
  }),
  }),
});

// Export hooks
export const {
  useCreateSurveyMutation,
  useDeleteSurveyMutation,
  useAssignSurveyMutation,
  useGetSurveyResponsesQuery,
  useGetUserSurveysQuery,
  useSubmitSurveyResponsesMutation,
  useGetAllSurveysQuery,
  useUpdateSurveyMutation,
  useGetSurveyDetailsQuery,
  useGetSurveyAssignmentsQuery,
  useGetSurveyAssignmentQuery,
  useGetUserSurveyResponsesQuery,
  useGetAllSurveyResponsesQuery,
  useGetUserSurveyResponsesByIdOrEmailQuery,
} = surveyApi;
