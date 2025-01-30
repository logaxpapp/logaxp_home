// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IShift, IShiftType, ShiftStatus } from '../types/shift';
import { IAppraisalMetric } from '../types/AppraisalMetric';
import { ISurvey, ISurveyResponse, IResponse, ISurveyAssignment } from '../types/survey';
import { IAppraisalPeriod } from '../types/AppraisalPeriod';
import { IAppraisalStatusReport, IAveragePerformanceReport } from '../types/reports';


import {
  SURVEY_API,
  APPRAISAL_METRIC_API,
  APPRAISAL_PERIOD_API,
  REPORTS_API,
  PAYPERIOD_API, 
} from './endpoints';

import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import setSessionExpire

import { IPayPeriod, PayrollCalculation, PayPeriodStatus } from '../types/payPeriodTypes'; // Import PayPeriod types


interface CsrfTokenResponse {
  csrfToken: string;
}


export const api = createApi({
  reducerPath: 'api',
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
  tagTypes: [
    'User',
    'Survey',
    'SurveyResponse',
    'AppraisalPeriod',
    'Report',
    'Shift',
    'ShiftType',
    'SurveyAssignment',
    'GoogleCalendarEvent',
    'PayPeriod',
    'EmployeePayPeriod'
  ],
  endpoints: (builder) => ({
    


      // Survey Endpoints
      createSurvey: builder.mutation<ISurvey, Partial<ISurvey>>({
        query: (body) => ({
          url: `${SURVEY_API}/admin/`,
          method: 'POST',
          body,
        }),
        invalidatesTags: [{ type: 'Survey', id: 'LIST' }],
      }),

      // Assign Survey Response - Admin Only
      assignSurvey: builder.mutation<void, { surveyId: string; userIds: string[]; dueDate?: string }>({
        query: ({ surveyId, userIds, dueDate }) => ({
          url: `${SURVEY_API}/admin/${surveyId}/assign`,
          method: 'POST',
          body: { userIds, dueDate },
        }),
        invalidatesTags: [{ type: 'Survey', id: 'LIST' }, { type: 'User', id: 'LIST' }],
      }),
      

     // User Survey Endpoints - User Only
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

          // Get a survey assignment by assignment ID
        getSurveyAssignment: builder.query<ISurveyAssignment, string>({
          query: (assignmentId) => `surveys/${assignmentId}`,  // Match the route you created in the backend
          providesTags: (result, error, assignmentId) => [{ type: 'SurveyAssignment', id: assignmentId }],
        }),

        // Submission Endpoints - Admin Only
        submitSurveyResponses: builder.mutation<ISurveyResponse, { assignmentId: string; responses: IResponse[] }>({
          query: ({ assignmentId, responses }) => ({
            url: `${SURVEY_API}/${assignmentId}/responses`,
            method: 'POST',
            body: { responses },
          }),
          invalidatesTags: (result, error, { assignmentId }) => [{ type: 'Survey', id: assignmentId }],
        }),

      // Question Endpoints - Admin Only
      getAllSurveys: builder.query<ISurvey[], void>({
        query: () => `${SURVEY_API}/admin/surveys`,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: 'Survey' as const, id: _id })),
                { type: 'Survey', id: 'LIST' },
              ]
            : [{ type: 'Survey', id: 'LIST' }],
      }),

      // Question Endpoints - Admin Only
        deleteSurvey: builder.mutation<{ message: string }, string>({
          query: (surveyId) => ({
            url: `${SURVEY_API}/admin/${surveyId}`,
            method: 'DELETE',
          }),
          invalidatesTags: (result, error, surveyId) => [{ type: 'Survey', id: surveyId }, { type: 'Survey', id: 'LIST' }],
        }),

      // Survey Endpoints
          updateSurvey: builder.mutation<ISurvey, { surveyId: string; updates: Partial<ISurvey> }>({
            query: ({ surveyId, updates }) => ({
              url: `${SURVEY_API}/admin/${surveyId}`,
              method: 'PUT',
              body: updates,
            }),
            invalidatesTags: (result, error, { surveyId }) => [{ type: 'Survey', id: surveyId }, { type: 'Survey', id: 'LIST' }],
          }),

          getSurveyDetails: builder.query<ISurvey, string>({
            query: (surveyId) => `${SURVEY_API}/surveys/${surveyId}`,
            providesTags: (result, error, surveyId) => [{ type: 'Survey', id: surveyId }],
          }),

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

                // Admin - Get all responses for a specific survey

        // Survey Response Endpoints - Admin Only
            getSurveyResponses: builder.query<ISurveyResponse[], string>({
              query: (surveyId) => {
                if (!surveyId) {
                  throw new Error("Survey ID is required to fetch responses.");
                }
                return `${SURVEY_API}/${surveyId}/responses`;
              },
              providesTags: (result, error, surveyId) =>
                result
                  ? [
                      ...result.map(({ _id }) => ({ type: 'SurveyResponse' as const, id: _id })),
                      { type: 'SurveyResponse', id: `LIST-${surveyId}` },
                    ]
                  : [{ type: 'SurveyResponse', id: `LIST-${surveyId}` }],
            }),
              
        // Admin - Get all responses across all surveys (optional)
        getAllSurveyResponses: builder.query<ISurveyResponse[], void>({
          query: () => `${SURVEY_API}/admin/responses`,
          providesTags: (result) =>
            result
              ? result.map(({ _id }) => ({ type: 'SurveyResponse' as const, id: _id }))
              : [{ type: 'SurveyResponse', id: 'ALL_RESPONSES' }],
        }),

        // User - Get their own responses across completed surveys
        getUserSurveyResponses: builder.query<ISurveyResponse[], void>({
          query: () => 'surveys/user/responses',
          providesTags: (result) =>
            result
              ? result.map(({ _id }) => ({ type: 'SurveyResponse' as const, id: _id }))
              : [{ type: 'SurveyResponse', id: 'USER_RESPONSES' }],
        }),
       // -----------------------
    // Report Endpoints
    
    // Fetch Approval Status Report
    fetchApprovalStatusReport: builder.query<IAppraisalStatusReport[], void>({
      query: () => `reports/approval-status`, // Ensure this endpoint matches your API route
      transformResponse: (response: IAppraisalStatusReport[]) => response,
      providesTags: (result) =>
        result
          ? [{ type: 'Report', id: 'ApprovalStatus' }]
          : [{ type: 'Report', id: 'ApprovalStatus' }],
    }),

    // Fetch Average Performance Rating Report
    fetchAveragePerformanceReport: builder.query<IAveragePerformanceReport[], void>({
      query: () => `/reports/average-performance-rating`,
      transformResponse: (response: { data: IAveragePerformanceReport[] }) => response.data,
      providesTags: [{ type: 'Report', id: 'AveragePerformance' }],
    }),


  // -----------------------
    // Appraisal Period Endpoints
    // -----------------------

    // Fetch Appraisal Periods
    fetchAppraisalPeriods: builder.query<{ data: IAppraisalPeriod[] }, void>({
      query: () => `${APPRAISAL_PERIOD_API}`,
      transformResponse: (response: { data?: IAppraisalPeriod[] } | IAppraisalPeriod[]) => {
        return Array.isArray(response) ? { data: response } : { data: response.data ?? [] };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'AppraisalPeriod' as const, id: _id })),
              { type: 'AppraisalPeriod', id: 'LIST' },
            ]
          : [{ type: 'AppraisalPeriod', id: 'LIST' }],
    }),
    
    // Create Appraisal Period

    createAppraisalPeriod: builder.mutation<IAppraisalPeriod, Partial<IAppraisalPeriod>>({
      query: (newPeriod) => ({
        url: `${APPRAISAL_PERIOD_API}`,
        method: 'POST',
        body: newPeriod,
      }),
      invalidatesTags: [{ type: 'AppraisalPeriod', id: 'LIST' }],
    }),

    // Update Appraisal Period
    updateAppraisalPeriod: builder.mutation<IAppraisalPeriod, { id: string; data: Partial<IAppraisalPeriod> }>({
      query: ({ id, data }) => ({
        url: `${APPRAISAL_PERIOD_API}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AppraisalPeriod', id }],
    }),

    // Delete Appraisal Period
    deleteAppraisalPeriod: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${APPRAISAL_PERIOD_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AppraisalPeriod', id }, { type: 'AppraisalPeriod', id: 'LIST' }],
    }),


    // Create Shift Type
    createShiftType: builder.mutation<IShiftType, Partial<IShiftType>>({
      query: (body) => ({
        url: 'admin/shifts/types',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ShiftType', id: 'LIST' }],
    }),

    getShiftTypes: builder.query<IShiftType[], void>({
      query: () => 'admin/shifts/types',
      transformResponse: (response: { shiftTypes: IShiftType[] }) => response.shiftTypes, // Access `shiftTypes` array directly
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'ShiftType' as const, id: _id })),
              { type: 'ShiftType', id: 'LIST' },
            ]
          : [{ type: 'ShiftType', id: 'LIST' }],
    }),

    // Update Shift Type
    updateShiftType: builder.mutation<IShiftType, { id: string; updates: Partial<IShiftType> }>({
      query: ({ id, updates }) => ({
        url: `admin/shifts/types/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ShiftType', id }],
    }),

    // Delete Shift Type
    deleteShiftType: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/shifts/types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'ShiftType', id },
        { type: 'ShiftType', id: 'LIST' },
      ],
    }),

    // Create Shift
    createShift: builder.mutation<IShift, Partial<IShift>>({
      query: (body) => ({
        url: 'admin/shifts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),

    // Get All Shifts
    getShifts: builder.query<{ shifts: IShift[]; total: number }, { status?: ShiftStatus; shiftTypeId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }>({
      query: ({ status, shiftTypeId, startDate, endDate, page = 1, limit = 10 }) => ({
        url: 'admin/shifts',
        method: 'GET',
        params: { status, shiftTypeId, startDate, endDate, page, limit },
      }),
      providesTags: (result) =>
        result && result.shifts
          ? [
              ...result.shifts.map(({ _id }) => ({ type: 'Shift' as const, id: _id })),
              { type: 'Shift', id: 'LIST' },
            ]
          : [{ type: 'Shift', id: 'LIST' }],
    }),
     // Get All Shifts
     getUserShifts: builder.query<{ shifts: IShift[]; total: number }, { status?: ShiftStatus; shiftTypeId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }>({
      query: ({ status, shiftTypeId, startDate, endDate, page = 1, limit = 10 }) => ({
        url: 'admin/shifts',
        method: 'GET',
        params: { status, shiftTypeId, startDate, endDate, page, limit },
      }),
      providesTags: (result) =>
        result && result.shifts
          ? [
              ...result.shifts.map(({ _id }) => ({ type: 'Shift' as const, id: _id })),
              { type: 'Shift', id: 'LIST' },
            ]
          : [{ type: 'Shift', id: 'LIST' }],
    }),

    // Update Shift
    updateShift: builder.mutation<IShift, { id: string; updates: Partial<IShift> }>({
      query: ({ id, updates }) => ({
        url: `admin/shifts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Shift', id }],
    }),

    // Delete Shift
    deleteShift: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/shifts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Shift', id },
        { type: 'Shift', id: 'LIST' },
      ],
    }),

    // Assign Shift to Single Employee
    assignShift: builder.mutation<IShift, { shiftId: string; userId: string }>({
      query: ({ shiftId, userId }) => ({
        url: 'admin/shifts/assign',
        method: 'POST',
        body: { shiftId, userId },
      }),
      invalidatesTags: (result, error, { shiftId }) => [{ type: 'Shift', id: shiftId }],
    }),

    // Assign Shift to All Employees
    assignShiftToAll: builder.mutation<IShift[], { shiftTypeId: string; date: string; startTime: string; endTime: string; applicationManaged: string[]; isExcess?: boolean }>({
      query: (body) => ({
        url: 'admin/shifts/assign/all',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),

    // Approve Shift Assignment
    approveShiftAssignment: builder.mutation<IShift, string>({
      query: (id) => ({
        url: `admin/shifts/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Shift', id }],
    }),

    // Reject Shift Assignment
    rejectShiftAssignment: builder.mutation<IShift, string>({
      query: (id) => ({
        url: `admin/shifts/${id}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Shift', id }],
    }),


    // View Schedule
    viewSchedule: builder.query<{ shifts: IShift[]; total: number }, void>({
      query: () => 'users/shifts/schedule',
      providesTags: (result) =>
        result && result.shifts
          ? [
              ...result.shifts.map(({ _id }) => ({ type: 'Shift' as const, id: _id })),
              { type: 'Shift', id: 'LIST' },
            ]
          : [{ type: 'Shift', id: 'LIST' }],
    }),

     // Fetch shifts assigned to an employee
     fetchShiftsByEmployee: builder.query<IShift[], string>({
      query: (employeeId) => `users/shifts/employee/${employeeId}`,
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Shift', id: _id }))
          : [{ type: 'Shift', id: 'LIST' }],
    }),

    // Request to Pick an Open Shift
    requestShift: builder.mutation<IShift, { shiftId: string }>({
      query: ({ shiftId }) => ({
        url: 'users/shifts/request',
        method: 'POST',
        body: { shiftId },
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),

    // Assign to Open Shift
    assignShiftToOpen: builder.mutation<IShift, { shiftId: string }>({
      query: ({ shiftId }) => ({
        url: 'users/shifts/assign',
        method: 'POST',
        body: { shiftId },
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),

    // Add this to your API slice

    // Create Multiple Shifts
    createMultipleShifts: builder.mutation<IShift[], {
      shiftTypeId: string;
      date: string;
      startTime: string;
      endTime: string;
      applicationManaged: string[];
      isExcess?: boolean;
      repeatDaily?: boolean;
      endDate?: string; // Only if creating shifts over a range of dates
      count?: number;    // Only if creating multiple shifts on the same day
    }>({
      query: (body) => ({
        url: 'admin/shifts/multiple', // Make sure this route is defined in your backend
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),
     // Fetch All PayPeriods
     fetchAllPayPeriods: builder.query<IPayPeriod[], void>({
      query: () => PAYPERIOD_API,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'PayPeriod' as const, id: _id })),
              { type: 'PayPeriod', id: 'LIST' },
            ]
          : [{ type: 'PayPeriod', id: 'LIST' }],
    }),

    // Fetch Single PayPeriod by ID
    fetchPayPeriodById: builder.query<IPayPeriod, string>({
      query: (id) => `${PAYPERIOD_API}/${id}`,
      providesTags: (result, error, id) => [{ type: 'PayPeriod', id }],
    }),

    // Create PayPeriod
    createPayPeriod: builder.mutation<IPayPeriod, { startDate: string; endDate: string }>({
      query: (body) => ({
        url: PAYPERIOD_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'PayPeriod', id: 'LIST' }],
    }),

    // Close PayPeriod
    closePayPeriod: builder.mutation<IPayPeriod, string>({
      query: (id) => ({
        url: `${PAYPERIOD_API}/${id}/close`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'PayPeriod', id }],
    }),

    // Process PayPeriod (Calculate Payroll)
    processPayPeriod: builder.mutation<PayrollCalculation, { id: string; hourlyRate: number; overtimeRate?: number }>({
      query: ({ id, hourlyRate, overtimeRate }) => ({
        url: `${PAYPERIOD_API}/${id}/process`,
        method: 'POST',
        body: { hourlyRate, overtimeRate },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PayPeriod', id }],
    }),

    // Update PayPeriod (if needed)
    updatePayPeriod: builder.mutation<IPayPeriod, { id: string; startDate?: string; endDate?: string; status?: PayPeriodStatus }>({
      query: ({ id, ...patch }) => ({
        url: `${PAYPERIOD_API}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PayPeriod', id }],
    }),

    // Delete PayPeriod (if applicable)
    deletePayPeriod: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${PAYPERIOD_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'PayPeriod', id }, { type: 'PayPeriod', id: 'LIST' }],
    }),
   
        }),
      });

export const {

  // Survey Hooks
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

  // Appraisal Period Hooks
  useFetchAppraisalPeriodsQuery,
  useCreateAppraisalPeriodMutation,
  useUpdateAppraisalPeriodMutation,
  useDeleteAppraisalPeriodMutation,

  // Report Hooks
  useFetchApprovalStatusReportQuery,
  useFetchAveragePerformanceReportQuery,

   // PayPeriod hooks
  useFetchAllPayPeriodsQuery,
  useFetchPayPeriodByIdQuery,
  useCreatePayPeriodMutation,
  useClosePayPeriodMutation,
  useProcessPayPeriodMutation,
  useUpdatePayPeriodMutation,
  useDeletePayPeriodMutation,

} = api;
