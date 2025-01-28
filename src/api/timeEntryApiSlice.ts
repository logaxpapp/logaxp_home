// src/api/timeEntryApiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; 
import { ITimeEntry, ITimeEntryInput, ITimeEntryUpdate } from '../types/timeEntry';
import { PaginationMetadata } from '../types/paginate';

const TIME_ENTRY_API = 'time-entries';

export const timeEntryApi = createApi({
  reducerPath: 'timeEntryApi',
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
  tagTypes: ['TimeEntry'],
  endpoints: (builder) => ({
    // --------------- CREATE (Clock-In) ---------------
    createTimeEntry: builder.mutation<ITimeEntry, ITimeEntryInput>({
      query: (timeEntry) => ({
        url: `${TIME_ENTRY_API}/clock-in`,
        method: 'POST',
        body: timeEntry,
      }),
      invalidatesTags: [{ type: 'TimeEntry', id: 'LIST' }],
      transformResponse: (response: any) => {
        if (response?.clockIn) {
          response.clockIn = new Date(response.clockIn).toISOString();
        }
        if (response?.clockOut) {
          response.clockOut = new Date(response.clockOut).toISOString();
        }
        if (response?.shift?.date) {
          response.shift.date = new Date(response.shift.date).toISOString();
        }
        return response;
      },      
    }),

    // --------------- UPDATE (Clock-Out) ---------------
    updateTimeEntry: builder.mutation<ITimeEntry, { id: string; updates: ITimeEntryUpdate }>({
      query: ({ id, updates }) => ({
        url: `${TIME_ENTRY_API}/clock-out/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'TimeEntry', id }],
      transformResponse: (response: any) => {
        if (response?.timeEntry?.clockIn) {
          response.timeEntry.clockIn = new Date(response.timeEntry.clockIn).toISOString();
        }
        if (response?.timeEntry?.clockOut) {
          response.timeEntry.clockOut = new Date(response.timeEntry.clockOut).toISOString();
        }
        return response;
      },
    }),

    // --------------- ADMIN UPDATE ---------------
    adminUpdateTimeEntry: builder.mutation<ITimeEntry, { id: string; updates: ITimeEntryUpdate }>({
      query: ({ id, updates }) => ({
        url: `${TIME_ENTRY_API}/admin/time-entries/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'TimeEntry', id }],
    }),

    // --------------- DELETE ---------------
    deleteTimeEntry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${TIME_ENTRY_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'TimeEntry', id }],
    }),

    // --------------- START BREAK ---------------
    startBreak: builder.mutation<ITimeEntry, string>({
      query: (timeEntryId) => ({
        url: `${TIME_ENTRY_API}/${timeEntryId}/start-break`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, timeEntryId) => [{ type: 'TimeEntry', id: timeEntryId }],
    }),

    // --------------- END BREAK ---------------
    endBreak: builder.mutation<ITimeEntry, string>({
      query: (timeEntryId) => ({
        url: `${TIME_ENTRY_API}/${timeEntryId}/end-break`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, timeEntryId) => [{ type: 'TimeEntry', id: timeEntryId }],
    }),

    // --------------- MARK ABSENT ---------------
    markAsAbsent: builder.mutation<ITimeEntry, { employeeId: string; reason: string; shiftId?: string }>({
      query: ({ employeeId, reason, shiftId }) => ({
        url: `${TIME_ENTRY_API}/mark-absent`,
        method: 'POST',
        body: { employeeId, reason, shiftId },
      }),
      invalidatesTags: [{ type: 'TimeEntry', id: 'LIST' }],
    }),

    // --------------- FETCH CURRENT STATUS ---------------
    fetchCurrentStatus: builder.query<any, string>({
      query: (employeeId) => `${TIME_ENTRY_API}/status/${employeeId}`,
      providesTags: (result, error, employeeId) => [{ type: 'TimeEntry', id: employeeId }],
      transformResponse: (response: any) => {
        // Convert date fields to strings for serialization
        if (response?.shift?.date) {
          response.shift.date = new Date(response.shift.date).toISOString();
        }
        return response;
      },
    }),

    // --------------- FETCH ABSENCES ---------------
    fetchAbsences: builder.query<any[], string>({
      query: (employeeId) => `${TIME_ENTRY_API}/absences/${employeeId}`,
      providesTags: (result, error, employeeId) => [{ type: 'TimeEntry', id: employeeId }],
    }),

    // --------------- FETCH TIME ENTRIES BY EMPLOYEE ---------------
    fetchTimeEntriesByEmployee: builder.query<
      { data: ITimeEntry[]; pagination: PaginationMetadata },
      { employeeId: string; page: number; limit: number }
    >({
      query: ({ employeeId, page, limit }) => `${TIME_ENTRY_API}/employee/${employeeId}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
          : [{ type: 'TimeEntry', id: 'LIST' }],
      transformResponse: (response: any) => {
        // Convert date fields to strings
        if (response?.data) {
          response.data = response.data.map((item: any) => ({
            ...item,
            clockIn: item.clockIn ? new Date(item.clockIn).toISOString() : null,
            clockOut: item.clockOut ? new Date(item.clockOut).toISOString() : null,
          }));
        }
        return response;
      },
    }),

    // --------------- FETCH TIME ENTRIES BY SHIFT ---------------
    fetchTimeEntriesByShift: builder.query<
      { data: ITimeEntry[]; pagination: PaginationMetadata },
      { shiftId: string; page: number; limit: number }
    >({
      query: ({ shiftId, page, limit }) => `${TIME_ENTRY_API}/shift/${shiftId}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
          : [{ type: 'TimeEntry', id: 'LIST' }],
    }),

    // --------------- FETCH TIME ENTRIES BY PAY PERIOD ---------------
    fetchTimeEntriesByPayPeriod: builder.query<
      { data: ITimeEntry[]; pagination: PaginationMetadata },
      { payPeriodId: string; page: number; limit: number }
    >({
      query: ({ payPeriodId, page, limit }) => `${TIME_ENTRY_API}/payPeriod/${payPeriodId}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
          : [{ type: 'TimeEntry', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useAdminUpdateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useStartBreakMutation,
  useEndBreakMutation,
  useMarkAsAbsentMutation,
  useFetchCurrentStatusQuery,
  useFetchAbsencesQuery,
  useFetchTimeEntriesByEmployeeQuery,
  useFetchTimeEntriesByShiftQuery,
  useFetchTimeEntriesByPayPeriodQuery,
} = timeEntryApi;
