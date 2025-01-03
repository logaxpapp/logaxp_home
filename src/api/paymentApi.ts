// src/api/paymentApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { IPayment, CreatePaymentRequest, PaymentSummaryResponse } from '../types/payment';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${BASE_URL}/api/payments`,
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
  tagTypes: ['Payment'],

  endpoints: (builder) => ({
    createPayment: builder.mutation<IPayment, CreatePaymentRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
    }),

    fetchPaymentsForContract: builder.query<IPayment[], string>({
      query: (contractId) => `/contract/${contractId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Payment' as const, id: _id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    confirmPayment: builder.mutation<IPayment, string>({
      query: (paymentId) => ({
        url: `/${paymentId}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),

    declinePayment: builder.mutation<IPayment, { paymentId: string; notes?: string }>({
      query: ({ paymentId, notes }) => ({
        url: `/${paymentId}/decline`,
        method: 'PUT',
        body: { notes },
      }),
      invalidatesTags: (result, error, { paymentId }) => [{ type: 'Payment', id: paymentId }],
    }),

    acceptPaymentAsContractor: builder.mutation<IPayment, string>({
      query: (paymentId) => ({
        url: `/${paymentId}/contractorAccept`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),

    declinePaymentAsContractor: builder.mutation<IPayment, { paymentId: string; reason?: string }>({
      query: ({ paymentId, reason }) => ({
        url: `/${paymentId}/contractorDecline`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { paymentId }) => [{ type: 'Payment', id: paymentId }],
    }),

    acknowledgePayment: builder.mutation<IPayment, string>({
      query: (paymentId) => ({
        url: `/${paymentId}/acknowledge`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),

    fetchPaymentSummary: builder.query<PaymentSummaryResponse, string>({
      query: (contractId) => `/summary/${contractId}`,
      providesTags: (result, error, contractId) => [
        { type: 'Payment', id: `SUMMARY-${contractId}` },
      ],
    }),

    sendPayment: builder.mutation<IPayment, string>({
      query: (paymentId) => ({
        url: `/${paymentId}/send`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),

    // **New Mutations**
    deletePayment: builder.mutation<{ message: string }, string>({
      query: (paymentId) => ({
        url: `/${paymentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),

    editPayment: builder.mutation<IPayment, { paymentId: string; updateData: Partial<IPayment> }>({
      query: ({ paymentId, updateData }) => ({
        url: `/${paymentId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { paymentId }) => [{ type: 'Payment', id: paymentId }],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useFetchPaymentsForContractQuery,
  useConfirmPaymentMutation,
  useDeclinePaymentMutation,
  useAcknowledgePaymentMutation,
  useFetchPaymentSummaryQuery,
  useSendPaymentMutation,

  useAcceptPaymentAsContractorMutation,
  useDeclinePaymentAsContractorMutation,

  // **New Hooks**
  useDeletePaymentMutation,
  useEditPaymentMutation,
} = paymentApi;
