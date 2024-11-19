import { IFAQInput } from './../types/support';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store'; // Root state type
import { setSessionExpired } from '../store/slices/sessionSlice'; // Handle session expiration
import { ISupportTicket, ISupportTicketInput, IFAQ } from '../types/support'; // Types for Support API
import { SUPPORT_API } from './endpoints';


// Define Support API slice
export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include cookies
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
  tagTypes: ['SupportTickets', 'FAQs'],
  endpoints: (builder) => ({
    // === TICKETS ===

    // Create a new support ticket
    createSupportTicket: builder.mutation<ISupportTicket, ISupportTicketInput>({
      query: (ticket) => ({
        url: `${SUPPORT_API}/tickets`,
        method: 'POST',
        body: ticket,
      }),
      invalidatesTags: [{ type: 'SupportTickets', id: 'LIST' }],
    }),

    // Fetch all tickets for the logged-in user
    fetchUserTickets: builder.query<ISupportTicket[], void>({
      query: () => `${SUPPORT_API}/tickets`,
      providesTags: [{ type: 'SupportTickets', id: 'LIST' }],
    }),

    // Fetch a specific ticket by ID
    fetchSupportTicketById: builder.query<ISupportTicket, string>({
      query: (ticketId) => `${SUPPORT_API}/tickets/${ticketId}`,
      providesTags: (result, error, ticketId) => [{ type: 'SupportTickets', id: ticketId }],
    }),

    // Update the status of a ticket
    updateTicketStatus: builder.mutation<ISupportTicket, { ticketId: string; status: string }>({
      query: ({ ticketId, status }) => ({
        url: `${SUPPORT_API}/tickets/status`,
        method: 'PUT',
        body: { ticketId, status },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'SupportTickets', id: ticketId }],
    }),

    // Update tags or priority of a ticket
    updateTicketDetails: builder.mutation<
      ISupportTicket,
      { ticketId: string; tags?: string[]; priority?: string }
    >({
      query: ({ ticketId, tags, priority }) => ({
        url: `${SUPPORT_API}/tickets/${ticketId}`,
        method: 'PUT',
        body: { ticketId, tags, priority },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'SupportTickets', id: ticketId }],
    }),

    // Delete a ticket
    deleteTicket: builder.mutation<{ success: boolean }, string>({
      query: (ticketId) => ({
        url: `${SUPPORT_API}/tickets/${ticketId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, ticketId) => [{ type: 'SupportTickets', id: ticketId }],
    }),

    patchTicketStatusByAdmin: builder.mutation({
        query: ({ ticketId, status }: { ticketId: string; status: string }) => ({
          url: `${SUPPORT_API}/admin/tickets/status`,
          method: 'PATCH',
          body: { ticketId, status },
        }),
        invalidatesTags: (result, error, { ticketId }) => [{ type: 'SupportTickets', id: ticketId }],
      }),      

    // === FAQs ===

    // Create a new FAQ (Admin Only)
    createFAQ: builder.mutation<IFAQ, IFAQInput>({
      query: (faq) => ({
        url: `${SUPPORT_API}/faqs`,
        method: 'POST',
        body: faq,
      }),
      invalidatesTags: [{ type: 'FAQs', id: 'LIST' }],
    }),

    // Fetch all FAQs
    fetchAllFAQs: builder.query<IFAQ[], void>({
      query: () => `${SUPPORT_API}/faqs`,
      providesTags: [{ type: 'FAQs', id: 'LIST' }],
    }),

    // Update an FAQ by ID (Admin Only)
    updateFAQ: builder.mutation<IFAQ, { faqId: string; question: string; answer: string }>({
      query: ({ faqId, question, answer }) => ({
        url: `${SUPPORT_API}/faqs/${faqId}`,
        method: 'PUT',
        body: { question, answer },
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FAQs', id: faqId }],
    }),

    // Delete an FAQ by ID (Admin Only)
    deleteFAQ: builder.mutation<{ success: boolean }, string>({
      query: (faqId) => ({
        url: `${SUPPORT_API}/faqs/${faqId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, faqId) => [{ type: 'FAQs', id: faqId }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateSupportTicketMutation,
  useFetchUserTicketsQuery,
  useFetchSupportTicketByIdQuery,
  useUpdateTicketStatusMutation,
  useUpdateTicketDetailsMutation,
  useDeleteTicketMutation,
  useCreateFAQMutation,
  useFetchAllFAQsQuery,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  usePatchTicketStatusByAdminMutation,
} = supportApi;
