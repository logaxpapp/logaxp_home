// 

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IShift, IShiftType, ShiftStatus } from '../types/shift';
import {
  SHIFT_API,
  SHIFT_TYPE_API,
} from './endpoints';

import type { RootState } from '../app/store';

interface CsrfTokenResponse {
  csrfToken: string;
}

export const shiftApi = createApi({
  reducerPath: 'shiftApi',
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
      // api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: [
    'Shift',
    'ShiftType',
  ],
  endpoints: (builder) => ({
      // --- Admin ShiftType Endpoints ---

      
    // CSRF Token Query
    getCsrfToken: builder.query<CsrfTokenResponse, void>({
        query: () => '/csrf-token',
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
  
      // --- Admin Shift Endpoints ---
  
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
  
      // --- User Shift Endpoints ---
  
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

    }),
});

export const {


// ShiftType Hooks
useCreateShiftTypeMutation,
useGetShiftTypesQuery,
useUpdateShiftTypeMutation,
useDeleteShiftTypeMutation,

// Admin Shift Hooks
useCreateShiftMutation,
useGetShiftsQuery,
useUpdateShiftMutation,
useDeleteShiftMutation,
useAssignShiftMutation,
useAssignShiftToAllMutation,
useApproveShiftAssignmentMutation,
useRejectShiftAssignmentMutation,
useCreateMultipleShiftsMutation,

// User Shift Hooks
useViewScheduleQuery,
useRequestShiftMutation,
useAssignShiftToOpenMutation,
useGetUserShiftsQuery,
useFetchShiftsByEmployeeQuery,

} = shiftApi;
