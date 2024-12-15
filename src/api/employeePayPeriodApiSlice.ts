// src/api/employeePayPeriodApiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IEmployeePayPeriod } from '../types/employeePayPeriod';
import { EMPLOYEE_PAYPERIOD_API } from './endpoints'; // Ensure EMPLOYEE_API is defined
import { setSessionExpired } from '../store/slices/sessionSlice';
import type { RootState } from '../app/store';

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
    // 1. Fetch All Employee Pay Periods for a Specific Pay Period
    fetchPayPeriodEmployeeRecords: builder.query<IEmployeePayPeriod[], string>({
      query: (payPeriodId) => `${EMPLOYEE_PAYPERIOD_API}/payPeriod/${payPeriodId}`,
      providesTags: (result, error, payPeriodId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'EmployeePayPeriod' as const, id: _id })),
              { type: 'EmployeePayPeriod' as const, id: 'LIST' },
            ]
          : [{ type: 'EmployeePayPeriod' as const, id: 'LIST' }],
    }),

    // 2. Fetch All Employee Pay Periods for a Specific Employee
    fetchEmployeePayPeriodsByEmployee: builder.query<IEmployeePayPeriod[], string>({
      query: (employeeId) => `${EMPLOYEE_PAYPERIOD_API}/employee/${employeeId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'EmployeePayPeriod' as const, id: _id })),
              { type: 'EmployeePayPeriod' as const, id: 'LIST' },
            ]
          : [{ type: 'EmployeePayPeriod' as const, id: 'LIST' }],
    }),

    // 3. Fetch Employee Pay Period Summary
    fetchEmployeePayPeriodSummary: builder.query<IEmployeePayPeriod, { payPeriodId: string; employeeId: string }>({
      query: ({ payPeriodId, employeeId }) => `${EMPLOYEE_PAYPERIOD_API}/summary/${payPeriodId}/${employeeId}`,
      providesTags: (result, error, { payPeriodId, employeeId }) => [
        { type: 'EmployeePayPeriod' as const, id: `${payPeriodId}-${employeeId}` },
      ],
    }),

    // 4. Fetch a Specific Employee Pay Period by ID
    fetchEmployeePayPeriodById: builder.query<IEmployeePayPeriod, string>({
      query: (id) => `${EMPLOYEE_PAYPERIOD_API}/${id}`,
      providesTags: (result, error, id) => [{ type: 'EmployeePayPeriod' as const, id }],
    }),

    // 5. Create Employee Pay Period
    createEmployeePayPeriod: builder.mutation<IEmployeePayPeriod, Partial<IEmployeePayPeriod>>({
      query: (data) => ({
        url: EMPLOYEE_PAYPERIOD_API,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'EmployeePayPeriod' as const, id: 'LIST' }],
    }),

    // 6. Update Employee Pay Period
    updateEmployeePayPeriod: builder.mutation<IEmployeePayPeriod, { id: string; updates: Partial<IEmployeePayPeriod> }>({
      query: ({ id, updates }) => ({
        url: `${EMPLOYEE_PAYPERIOD_API}/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmployeePayPeriod' as const, id }],
    }),

    // 7. Delete Employee Pay Period
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
  useFetchEmployeePayPeriodsByEmployeeQuery,
  useFetchEmployeePayPeriodSummaryQuery,
  useFetchEmployeePayPeriodByIdQuery,
  useCreateEmployeePayPeriodMutation,
  useUpdateEmployeePayPeriodMutation,
  useDeleteEmployeePayPeriodMutation,
} = employeePayPeriodApi;
