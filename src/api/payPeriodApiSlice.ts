 ///src\api\payPeriodApiSlice.ts 
 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPayPeriod, PayrollCalculation, PayPeriodStatus } from '../types/payPeriodTypes';
import { PAYPERIOD_API } from './endpoints';
import type { RootState } from '../app/store'; // Import RootState
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action

export const payPeriodApi = createApi({
  reducerPath: 'payPeriodApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include credentials (e.g., cookies)
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
  tagTypes: ['PayPeriod'],
  endpoints: (builder) => ({
    // Fetch all PayPeriods
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

    // Fetch a single PayPeriod by ID
    fetchPayPeriodById: builder.query<IPayPeriod, string>({
      query: (id) => `${PAYPERIOD_API}/${id}`,
      providesTags: (result, error, id) => [{ type: 'PayPeriod', id }],
    }),

    // Create a new PayPeriod
    createPayPeriod: builder.mutation<IPayPeriod, { startDate: string; endDate: string }>({
      query: (body) => ({
        url: PAYPERIOD_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'PayPeriod', id: 'LIST' }],
    }),

    // Close an existing PayPeriod
    closePayPeriod: builder.mutation<IPayPeriod, string>({
      query: (id) => ({
        url: `${PAYPERIOD_API}/${id}/close`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'PayPeriod', id }],
    }),

    // Process a PayPeriod (calculate payroll)
    processPayPeriod: builder.mutation<
      PayrollCalculation,
      { id: string; hourlyRate: number; overtimeRate?: number }
    >({
      query: ({ id, hourlyRate, overtimeRate }) => ({
        url: `${PAYPERIOD_API}/${id}/process`,
        method: 'POST',
        body: { hourlyRate, overtimeRate },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PayPeriod', id }],
    }),

    // Get summary for an employee in a specific PayPeriod
    fetchEmployeePayPeriodSummary: builder.query<
      PayrollCalculation,
      { id: string; employeeId: string }
    >({
      query: ({ id, employeeId }) => `${PAYPERIOD_API}/${id}/summary/${employeeId}`,
      providesTags: (result, error, { id, employeeId }) => [
        { type: 'PayPeriod', id: `${id}-${employeeId}` },
      ],
    }),

    // Update PayPeriod
    updatePayPeriod: builder.mutation<
      IPayPeriod,
      { id: string; startDate?: string; endDate?: string; status?: PayPeriodStatus }
    >({
      query: ({ id, ...patch }) => ({
        url: `${PAYPERIOD_API}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PayPeriod', id }],
    }),

    // Delete a PayPeriod
    deletePayPeriod: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${PAYPERIOD_API}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PayPeriod', id },
        { type: 'PayPeriod', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useFetchAllPayPeriodsQuery,
  useFetchPayPeriodByIdQuery,
  useCreatePayPeriodMutation,
  useClosePayPeriodMutation,
  useProcessPayPeriodMutation,
  useFetchEmployeePayPeriodSummaryQuery,
  useDeletePayPeriodMutation,
  useUpdatePayPeriodMutation,
} = payPeriodApi;
