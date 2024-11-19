// src\api\employeePayPeriodApiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IEmployeePayPeriod } from '../types/employeePayPeriod';
import { EMPLOYEE_PAYPERIOD_API, PAYPERIOD_API } from './endpoints';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action
import type { RootState } from '../app/store'; // Import RootState

export const employeePayPeriodApi = createApi({
  reducerPath: 'employeePayPeriodApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include credentials for cookies
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken); // Add CSRF token if available
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
  tagTypes: ['EmployeePayPeriod'], // Ensure this matches the type used in `providesTags`
  endpoints: (builder) => ({
    fetchPayPeriodEmployeeRecords: builder.query<IEmployeePayPeriod[], string>({
      query: (payPeriodId) => `${PAYPERIOD_API}/${payPeriodId}/employeePayPeriods`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'EmployeePayPeriod' as const, id: _id })),
              { type: 'EmployeePayPeriod' as const, id: 'LIST' },
            ]
          : [{ type: 'EmployeePayPeriod' as const, id: 'LIST' }],
    }),
    fetchEmployeePayPeriodSummary: builder.query<IEmployeePayPeriod, { payPeriodId: string; employeeId: string }>({
      query: ({ payPeriodId, employeeId }) => `${PAYPERIOD_API}/${payPeriodId}/summary/${employeeId}`,
      providesTags: (result, error, { payPeriodId, employeeId }) => [
        { type: 'EmployeePayPeriod' as const, id: `${payPeriodId}-${employeeId}` },
      ],
    }),
    createEmployeePayPeriod: builder.mutation<IEmployeePayPeriod, Partial<IEmployeePayPeriod>>({
      query: (data) => ({
        url: EMPLOYEE_PAYPERIOD_API,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'EmployeePayPeriod' as const, id: 'LIST' }],
    }),
    updateEmployeePayPeriod: builder.mutation<IEmployeePayPeriod, { id: string; updates: Partial<IEmployeePayPeriod> }>({
      query: ({ id, updates }) => ({
        url: `${EMPLOYEE_PAYPERIOD_API}/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmployeePayPeriod' as const, id }],
    }),
    deleteEmployeePayPeriod: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${EMPLOYEE_PAYPERIOD_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'EmployeePayPeriod' as const, id }],
    }),
  }),
});

export const {
  useFetchPayPeriodEmployeeRecordsQuery,
  useFetchEmployeePayPeriodSummaryQuery,
  useCreateEmployeePayPeriodMutation,
  useUpdateEmployeePayPeriodMutation,
  useDeleteEmployeePayPeriodMutation,
} = employeePayPeriodApi;
