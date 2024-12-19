// src/api/newsletterApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';
import {
  INewsletter,
  INewsletterSubscriptionResponse,
  INewsletterSubscriptionListResponse,
  SubscribeRequest,
  SendNewsletterRequest,
  SendNewsletterResponse,
  ConfirmSubscriptionResponse,
  UnsubscribeResponse,
} from '../types/Newsletter';
import { SubscriptionStatus } from '../types/enums';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
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
    // Public: Subscribe to Newsletter
    subscribe: builder.mutation<INewsletterSubscriptionResponse, SubscribeRequest>({
      query: (body) => ({
        url: 'newsletter/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'NewsletterSubscriptions', id: 'LIST' }],
    }),

    // Public: Confirm Subscription
    confirmSubscription: builder.query<ConfirmSubscriptionResponse, string>({
      query: (token) => `newsletter/confirm/${token}`,
      providesTags: (result, error, token) => [{ type: 'Newsletter', id: token }],
    }),

    // Public: Unsubscribe
    unsubscribe: builder.query<UnsubscribeResponse, string>({
      query: (token) => `newsletter/unsubscribe/${token}`,
      providesTags: (result, error, token) => [{ type: 'Newsletter', id: token }],
    }),

    // Admin: Send Newsletter
    sendNewsletter: builder.mutation<SendNewsletterResponse, SendNewsletterRequest>({
      query: (body) => ({
        url: 'newsletter/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'NewsletterSubscriptions', id: 'LIST' }],
    }),

    // Admin: Get All Subscriptions (Optional)
    listSubscriptions: builder.query<INewsletterSubscriptionListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: 'newsletter/subscriptions',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Newsletter', id: _id } as const)),
              { type: 'NewsletterSubscriptions', id: 'LIST' },
            ]
          : [{ type: 'NewsletterSubscriptions', id: 'LIST' }],
    }),

      // Admin: Delete Subscription (Optional)
      deleteSubscription: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `newsletter/subscriptions/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Newsletter', id }],
      }),

      // Admin: Suspend Subscription
      suspendSubscription: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `newsletter/subscriptions/${id}/suspend`,
          method: 'PATCH',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Newsletter', id }],
      }),

      //Admin : Confirm Subscription
      confirmSubscriptionById: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `newsletter/subscriptions/${id}/confirm`,
          method: 'PATCH',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Newsletter', id }],
      }),

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
  useSubscribeMutation,
  useConfirmSubscriptionQuery,
  useUnsubscribeQuery,
  useSendNewsletterMutation,
  useListSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useSuspendSubscriptionMutation,
  useConfirmSubscriptionByIdMutation,
  // new exports
  useGetAllNewslettersQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
} = newsletterApi;
