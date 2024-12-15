import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITimeEntry, ITimeEntryInput, ITimeEntryUpdate } from '../types/timeEntry';
import { IShift } from '../types/shift';
import { PaginationMetadata } from '../types/paginate';
import { TIME_ENTRY_API } from './endpoints';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action
import type { RootState } from '../app/store'; // Import RootState

export const timeEntryApi = createApi({
  reducerPath: 'timeEntryApi',
  baseQuery: async (args, timeEntryApi, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken); // Attach CSRF token
          console.log('CSRF Token attached to headers From TimeEntryApi:', csrfToken); // Debug
        }
        return headers;
      },
    });

    const result = await base(args, timeEntryApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      timeEntryApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['TimeEntry'],
  endpoints: (builder) => ({
    // Fetch Shifts by Employee ID
    fetchShiftsByEmployee: builder.query<{ shifts: IShift[] }, string>({
      query: (employeeId) => `${TIME_ENTRY_API}/shifts?employee=${employeeId}`,
      providesTags: (result) =>
        result
          ? result.shifts.map(({ _id }) => ({ type: 'TimeEntry' as const, id: _id }))
          : [{ type: 'TimeEntry', id: 'LIST' }],
    }),
  
      // Fetch Time Entries by Employee ID
      fetchTimeEntriesByEmployee: builder.query<
        { data: ITimeEntry[]; pagination: PaginationMetadata },
        { employeeId: string; page: number; limit: number }
      >({
        query: ({ employeeId, page, limit }) =>
          `${TIME_ENTRY_API}/employee/${employeeId}?page=${page}&limit=${limit}`,
        providesTags: (result) =>
          result?.data
            ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
            : [{ type: 'TimeEntry', id: 'LIST' }],
      }),


    // Fetch Time Entries by Shift ID
    fetchTimeEntriesByShift: builder.query<
      { data: ITimeEntry[]; pagination: PaginationMetadata },
      { shiftId: string; page: number; limit: number }
    >({
      query: ({ shiftId, page, limit }) =>
        `${TIME_ENTRY_API}/shift/${shiftId}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
          : [{ type: 'TimeEntry', id: 'LIST' }],
    }),


    // Fetch Time Entries by Pay Period ID
    fetchTimeEntriesByPayPeriod: builder.query<
        { data: ITimeEntry[]; pagination: PaginationMetadata },
        { payPeriodId: string; page: number; limit: number }
      >({
        query: ({ payPeriodId, page, limit }) =>
          `${TIME_ENTRY_API}/payPeriod/${payPeriodId}?page=${page}&limit=${limit}`,
        providesTags: (result) =>
          result?.data
            ? result.data.map(({ _id }) => ({ type: 'TimeEntry', id: _id }))
            : [{ type: 'TimeEntry', id: 'LIST' }],
      }),
  

    createTimeEntry: builder.mutation<ITimeEntry, ITimeEntryInput>({
        query: (timeEntry) => ({
          url:  `${TIME_ENTRY_API}/clock-in`,      // clock-in
          method: 'POST',
          body: timeEntry,
        }),
        invalidatesTags: [{ type: 'TimeEntry', id: 'LIST' }],
      }),
  
      updateTimeEntry: builder.mutation<ITimeEntry, { id: string; updates: ITimeEntryUpdate }>({
        query: ({ id, updates }) => ({
          url: `${TIME_ENTRY_API}/clock-out/${id}`,  // clock-out
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'TimeEntry', id }],
      }),

      adminUpdateTimeEntry: builder.mutation<ITimeEntry, { id: string; updates: ITimeEntryUpdate }>({
        query: ({ id, updates }) => ({
          url: `${TIME_ENTRY_API}/admin/time-entries/${id}`, // Admin-specific endpoint
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'TimeEntry', id }],
      }),
      

    // Delete a Time Entry
    deleteTimeEntry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${TIME_ENTRY_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'TimeEntry', id }],
    }),
  // Start a Break
  startBreak: builder.mutation<ITimeEntry, string>({
    query: (timeEntryId) => ({
      url: `${TIME_ENTRY_API}/${timeEntryId}/start-break`,
      method: 'PUT',
    }),
    invalidatesTags: (result, error, timeEntryId) => [{ type: 'TimeEntry', id: timeEntryId }],
  }),

  // End a Break
  endBreak: builder.mutation<ITimeEntry, string>({
    query: (timeEntryId) => ({
      url: `${TIME_ENTRY_API}/${timeEntryId}/end-break`,
      method: 'PUT',
    }),
    invalidatesTags: (result, error, timeEntryId) => [{ type: 'TimeEntry', id: timeEntryId }],
  }),

  // Mark as Absent
  markAsAbsent: builder.mutation<ITimeEntry, { employeeId: string; reason: string; shiftId?: string }>({
    query: ({ employeeId, reason, shiftId }) => ({
      url: `${TIME_ENTRY_API}/mark-absent`,
      method: 'POST',
      body: { employeeId, reason, shiftId },
    }),
    invalidatesTags: [{ type: 'TimeEntry', id: 'LIST' }],
  }),
// Fetch current status for an employee
fetchCurrentStatus: builder.query<any, string>({
    query: (employeeId) => `${TIME_ENTRY_API}/status/${employeeId}`,
    
    providesTags: (result, error, employeeId) => [{ type: 'TimeEntry', id: employeeId }],
  }),

  fetchAbsences: builder.query<any[], string>({
    query: (employeeId) => `${TIME_ENTRY_API}/absences/${employeeId}`,
    providesTags: (result, error, employeeId) => [{ type: 'TimeEntry', id: employeeId }],
  }),

}),
});

export const {
useFetchTimeEntriesByEmployeeQuery,
useFetchTimeEntriesByShiftQuery,
useFetchTimeEntriesByPayPeriodQuery,
useCreateTimeEntryMutation,
useUpdateTimeEntryMutation,
useDeleteTimeEntryMutation,
useStartBreakMutation,
useEndBreakMutation,
useMarkAsAbsentMutation,
useFetchCurrentStatusQuery, 
useFetchAbsencesQuery,
useFetchShiftsByEmployeeQuery,
useAdminUpdateTimeEntryMutation
} = timeEntryApi;