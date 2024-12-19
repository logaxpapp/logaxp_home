import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { INewsletter } from '../types/Newsletter';
import { SubscriptionStatus } from '../types/enums';

export const sendNewsletterApi = createApi({
  reducerPath: 'sendNewsletterApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include cookies if needed
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
        return headers;
      },
    });

    const result = await base(args, api, extraOptions);

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['NewsletterSubscriptions', 'Newsletter'],
  endpoints: (builder) => ({
    // Correctly name the query as 'getAllNewsletters'
    getAllNewsletters: builder.query<INewsletter[], void>({
      query: () => 'newsletters',
      providesTags: ['Newsletter'],
    }),
    createNewsletter: builder.mutation<INewsletter, { subject: string; content: string; image?: string }>({
      query: (body) => ({
        url: 'newsletters',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Newsletter'],
    }),
    updateNewsletter: builder.mutation<INewsletter, { id: string; updates: Partial<INewsletter> }>({
      query: ({ id, updates }) => ({
        url: `newsletters/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Newsletter'],
    }),
    deleteNewsletter: builder.mutation<void, string>({
      query: (id) => ({
        url: `newsletters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Newsletter'],
    }),
  }),
});

export const {
  useGetAllNewslettersQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
} = sendNewsletterApi;
