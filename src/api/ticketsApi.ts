// src/api/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITicket } from '../types/ticket';
import { TICKET_API } from './endpoints';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';

// Types for new requests
interface UpdateTicketStatusArgs {
  ticketId: string;
  status: string;
}

interface AssignTicketArgs {
  ticketId: string;
  assigneeId: string;
}

interface AddCommentArgs {
  ticketId: string;
  content: string;
}

interface UpdateTicketArgs {
  ticketId: string;
  updates: Partial<ITicket>;
}

interface UpdateCustomFieldsArgs {
  ticketId: string;
  fields: Record<string, any>;
}

interface AddWatcherArgs {
  ticketId: string;
  userId: string; // The user to add as watcher
}

interface RemoveWatcherArgs {
  ticketId: string;
  userId: string;
}

// Interface for advanced filtering response
interface TicketsResponse {
  tickets: ITicket[];
  total: number;
}

interface AdvancedTicketQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  department?: string;
  skip?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  dueStartDate?: string;
  dueEndDate?: string;
  // Additional sorting or filtering as needed
}
interface MultipleWatchersArgs {
  ticketIds: string[];
  userId: string;
}

interface Watcher {
  _id: string;
  name: string;
  email: string;
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
    'EmployeePayPeriod',
  ],
  endpoints: (builder) => ({
    // Fetch All Tickets
    fetchTickets: builder.query<TicketsResponse, { skip: number; limit: number }>({
      query: ({ skip = 0, limit = 10 }) => `${TICKET_API}?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Fetch Ticket by ID
    fetchTicketById: builder.query<ITicket, string>({
      query: (ticketId) => `${TICKET_API}/${ticketId}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),

    // Fetch Personal Tickets
    fetchPersonalTickets: builder.query<TicketsResponse, void>({
      query: () => `${TICKET_API}/personal`,
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
              { type: 'Ticket', id: 'PERSONAL_LIST' },
            ]
          : [{ type: 'Ticket', id: 'PERSONAL_LIST' }],
    }),

    // Create Ticket
    createTicket: builder.mutation<ITicket, Partial<ITicket>>({
      query: (body) => ({
        url: TICKET_API,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Update Ticket
    updateTicket: builder.mutation<ITicket, UpdateTicketArgs>({
      query: ({ ticketId, updates }) => ({
        url: `${TICKET_API}/${ticketId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Delete Ticket
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
    addCommentToTicket: builder.mutation<ITicket, AddCommentArgs>({
      query: ({ ticketId, content }) => ({
        url: `${TICKET_API}/${ticketId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Update Ticket Status
    updateTicketStatus: builder.mutation<ITicket, UpdateTicketStatusArgs>({
      query: ({ ticketId, status }) => ({
        url: `${TICKET_API}/${ticketId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Assign Ticket
    assignTicket: builder.mutation<ITicket, AssignTicketArgs>({
      query: ({ ticketId, assigneeId }) => ({
        url: `${TICKET_API}/${ticketId}/assign`,
        method: 'PUT',
        body: { assigneeId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Add Watcher
    addWatcherToTicket: builder.mutation<ITicket, AddWatcherArgs>({
      query: ({ ticketId, userId }) => ({
        url: `${TICKET_API}/${ticketId}/watchers`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Remove Watcher
    removeWatcherFromTicket: builder.mutation<ITicket, RemoveWatcherArgs>({
      query: ({ ticketId, userId }) => ({
        url: `${TICKET_API}/${ticketId}/watchers/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Update Custom Fields
    updateTicketCustomFields: builder.mutation<ITicket, UpdateCustomFieldsArgs>({
      query: ({ ticketId, fields }) => ({
        url: `${TICKET_API}/${ticketId}/custom-fields`,
        method: 'PATCH',
        body: { fields },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),

    // Advanced Ticket Queries
    fetchAdvancedTickets: builder.query<TicketsResponse, AdvancedTicketQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, val]) => {
            if (val !== undefined && val !== null) {
              acc[key] = val.toString();
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        return `${TICKET_API}/advanced?${queryParams}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
      }),
      // NEW: Fetch Ticket Watchers
      fetchTicketWatchers: builder.query<{ watchers: Watcher[] }, string>({
        query: (ticketId) => `${TICKET_API}/${ticketId}/watchers`,
        providesTags: (result, error, ticketId) => [{ type: 'Ticket', id: ticketId }],
      }),

      // NEW: Add Watcher to Multiple Tickets
      addWatcherToMultipleTickets: builder.mutation<
        { results: { ticketId: string; status: string }[] },
        MultipleWatchersArgs
      >({
        query: ({ ticketIds, userId }) => ({
          url: `${TICKET_API}/watchers`,
          method: 'POST',
          body: { ticketIds, userId },
        }),
        invalidatesTags: (result) =>
          result
            ? result.results.map((r) => ({ type: 'Ticket' as const, id: r.ticketId }))
            : [],
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
  useAddWatcherToTicketMutation,
  useRemoveWatcherFromTicketMutation,
  useUpdateTicketCustomFieldsMutation,
  useFetchAdvancedTicketsQuery,
  useFetchTicketWatchersQuery,
  useAddWatcherToMultipleTicketsMutation,
} = ticketsApi;
