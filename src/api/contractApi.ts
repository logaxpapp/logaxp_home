// src/api/contractApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { IContract, IContractor, ContractResponse, CreateContractRequest, UpdateContractRequest } from '../types/contractTypes';
import { setSessionExpired } from '../store/slices/sessionSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const contractApi = createApi({
  reducerPath: 'contractApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${BASE_URL}/api`,
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
  tagTypes: ['Contractor', 'Contract'],
  endpoints: (builder) => ({
    // Fetch Contractors
    fetchContractors: builder.query<IContractor[], { skip: number; limit: number }>({
      query: ({ skip = 0, limit = 10 }) => `/contracts/contractors?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Contractor' as const, id: _id })),
              { type: 'Contractor', id: 'LIST' },
            ]
          : [{ type: 'Contractor', id: 'LIST' }],
    }),
    
    // Fetch Contractor by I

    fetchContractorById: builder.query<IContractor, string>({
      query: (id) => `/contracts/contractors/${id}`,
      // Removed transformResponse since paymentTerms is not part of contractor data
      providesTags: (result, error, id) => [{ type: 'Contractor', id }],
    }),

    fetchCurrentContractor: builder.query<IContractor, void>({
      query: () => `/contracts/contractors/me`,
      providesTags: (result, error) => [{ type: 'Contractor', id: 'CURRENT' }],
    }),
    
    // Update Contractor
    updateContractor: builder.mutation<IContractor, Partial<IContractor> & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/contracts/contractors/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contractor', id }],
    }),

    fetchContracts: builder.query<ContractResponse, { skip: number; limit: number }>({
      query: ({ skip = 0, limit = 10 }) => `/contracts?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result?.contracts
          ? [
              ...result.contracts.map(({ _id }) => ({ type: 'Contract' as const, id: _id })),
              { type: 'Contract', id: 'LIST' },
            ]
          : [{ type: 'Contract', id: 'LIST' }],
    }),
    
    // Fetch Contract by ID
    fetchContractById: builder.query<IContract, string>({
      query: (id) => `/contracts/contractbyID/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contract', id }],
    }),

     // Create Contract
     createContract: builder.mutation<IContract, CreateContractRequest>({
      query: (data) => ({
        url: `/contracts/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Contract', id: 'LIST' }],
    }),

    // Update Contract
    updateContract: builder.mutation<IContract, { id: string; updates: UpdateContractRequest }>({
      query: ({ id, updates }) => ({
        url: `/contracts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contract', id }],
    }),

    // Delete Contract
    deleteContract: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Contract', id }, { type: 'Contract', id: 'LIST' }],
    }),

    // Accept Contract
    acceptContract: builder.mutation<IContract, string>({
      query: (id) => ({
        url: `/contracts/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Contract', id }],
    }),

    // Decline Contract
    declineContract: builder.mutation<IContract, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/contracts/${id}/decline`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contract', id }],
    }),

    // Update Contract Status
    updateContractStatus: builder.mutation<IContract, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/contracts/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contract', id }],
    }),

    fetchContractsByContractor: builder.query<IContract[], string>({
      query: (contractorId) => `/contracts/contractor/${contractorId}`,
      providesTags: (result, error, contractorId) =>
        result
          ? [
              // Tag each contract
              ...result.map(({ _id }) => ({ type: 'Contract' as const, id: _id })),
              // And maybe a special tag to refetch if needed
              { type: 'Contract', id: `CONTRACTOR-${contractorId}` },
            ]
          : [{ type: 'Contract', id: `CONTRACTOR-${contractorId}` }],
    }),
  }),
});

export const {
  useFetchContractorsQuery,
  useFetchContractorByIdQuery,
  useUpdateContractorMutation,
  useFetchContractsQuery,
  useFetchContractByIdQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useAcceptContractMutation,
  useDeclineContractMutation,
  useUpdateContractStatusMutation,
  useFetchCurrentContractorQuery,
  useFetchContractsByContractorQuery,
} = contractApi;
