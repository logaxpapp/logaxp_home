// src/api/faqApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';

// Types
export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  application: string; 
  createdBy: string;   // string for simplicity
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface IFAQListResponse {
  data: IFAQ[];
  total: number;
  page: number;
  limit: number;
}

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include cookies
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
        return headers;
      },
    });

    const result = await base(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['ApplicationFAQs', 'FAQ'],
  endpoints: (builder) => ({
    // Public: Get all FAQs with pagination
    listFAQs: builder.query<IFAQListResponse, { application?: string; page?: number; limit?: number }>({
      query: ({ application, page = 1, limit = 10 }) => ({
        url: 'faqs',
        params: { application, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'FAQ' as const, id: _id })),
              { type: 'ApplicationFAQs', id: 'LIST' },
            ]
          : [{ type: 'ApplicationFAQs', id: 'LIST' }],
    }),

    // Admin: Create FAQ
    createFAQ: builder.mutation<IFAQ, Partial<IFAQ>>({
      query: (body) => ({
        url: 'faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ApplicationFAQs', id: 'LIST' }],
    }),

    // Admin: Update FAQ
    updateFAQ: builder.mutation<IFAQ, { id: string; data: Partial<IFAQ> }>({
      query: ({ id, data }) => ({
        url: `faqs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FAQ', id }],
    }),

    // Admin: Delete FAQ
    deleteFAQ: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ApplicationFAQs', id: 'LIST' }],
    }),

    // Get FAQ by ID
    getFAQById: builder.query<IFAQ, string>({
      query: (id) => `faqs/${id}`,
      providesTags: (result, error, id) => [{ type: 'FAQ', id }],
    }),

    getPublishedFAQs: builder.query<IFAQListResponse, { application?: string; page?: number; limit?: number }>({
      query: ({ application, page = 1, limit = 10 }) => ({
        url: 'faqs/published',
        params: { application, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'FAQ' as const, id: _id })),
              { type: 'ApplicationFAQs', id: 'PUBLISHED_LIST' },
            ]
          : [{ type: 'ApplicationFAQs', id: 'PUBLISHED_LIST' }],
    }),

    // New: Publish FAQ
    publishFAQ: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `faqs/${id}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'FAQ', id }],
    }),

    // New: Unpublish FAQ
    unpublishFAQ: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `faqs/${id}/unpublish`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'FAQ', id }],
    }),
  }),
});

export const {
  useListFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetFAQByIdQuery,
  useGetPublishedFAQsQuery,
  usePublishFAQMutation,
  useUnpublishFAQMutation,
} = faqApi;
