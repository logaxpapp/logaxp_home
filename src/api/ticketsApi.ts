// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITicket } from '../types/ticket';


import {
 
  TICKET_API,
  
} from './endpoints';

import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import setSessionExpire

interface CsrfTokenResponse {
  csrfToken: string;
}
export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: async (args, ticketsApi, extraOptions) => {
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

    const result = await base(args, ticketsApi, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      ticketsApi.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: [
    'User',
    'Auth',
    'Ticket',
    'Approval',
    'Survey',
    'SurveyResponse',
    'DeletionRequest',
    'Auth',
    'AppraisalQuestion',
    'AppraisalMetric',
    'AppraisalPeriod',
    'Report',
    'Shift',
    'ShiftType',
    'SurveyAssignment',
    'GoogleCalendarEvent',
    'PayPeriod',
    'EmployeePayPeriod'
  ],
  endpoints: (builder) => ({
    

    // CSRF Token Query
    getCsrfToken: builder.query<CsrfTokenResponse, void>({
      query: () => '/csrf-token',
    }),

    // Ticket Endpoints (As previously defined)
    fetchTickets: builder.query<{ tickets: ITicket[]; total: number }, void>({
      query: () => TICKET_API,
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Fetch Ticket by ID endpoint
    fetchTicketById: builder.query<ITicket, string>({
      query: (ticketId) => `${TICKET_API}/${ticketId}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),

    fetchPersonalTickets: builder.query<{ tickets: ITicket[]; total: number }, void>({
      query: () => `${TICKET_API}/personal`,
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
              { type: 'Ticket', id: 'PERSONAL_LIST' },
            ]
          : [{ type: 'Ticket', id: 'PERSONAL_LIST' }],
    }),
    

    // Create Ticket Mutation
    createTicket: builder.mutation<ITicket, Partial<ITicket>>({
      query: (body) => ({
        url: TICKET_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Edit Ticket Mutation
    updateTicket: builder.mutation<ITicket, { ticketId: string; updates: Partial<ITicket> }>({
      query: ({ ticketId, updates }) => ({
        url: `${TICKET_API}/${ticketId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Delete Ticket Mutation


      deleteTicket: builder.mutation<{ message: string }, string>({
        query: (ticketId) => ({
          url: `${TICKET_API}/${ticketId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, ticketId) => [
          { type: 'Ticket', id: ticketId },
          { type: 'Ticket', id: 'PERSONAL_LIST' },
        ],
        async onQueryStarted(ticketId, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            ticketsApi.util.updateQueryData('fetchPersonalTickets', undefined, (draft) => {
              draft.tickets = draft.tickets.filter((ticket) => ticket._id !== ticketId);
            })
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),

    // Add Comment to Ticket
    addCommentToTicket: builder.mutation<
      ITicket,
      { ticketId: string; content: string }
    >({
      query: ({ ticketId, content }) => ({
        url: `${TICKET_API}/${ticketId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Update Ticket Status Mutation
    updateTicketStatus: builder.mutation<
      ITicket,
      { ticketId: string; status: string }
    >({
      query: ({ ticketId, status }) => ({
        url: `${TICKET_API}/${ticketId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Assign Ticket Mutation
    assignTicket: builder.mutation<
      ITicket,
      { ticketId: string; assigneeId: string }
    >({
      query: ({ ticketId, assigneeId }) => ({
        url: `${TICKET_API}/${ticketId}/assign`,
        method: 'PUT',
        body: { assigneeId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),
  }),
});

export const {
   // Ticket Hooks
   useFetchTicketsQuery,
   useFetchTicketByIdQuery,
   useCreateTicketMutation,
   useUpdateTicketMutation,
   useDeleteTicketMutation,
   useAddCommentToTicketMutation,
   useUpdateTicketStatusMutation,
   useAssignTicketMutation,
   useFetchPersonalTicketsQuery,

} = ticketsApi;
