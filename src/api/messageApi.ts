// src/api/messageApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { IMessage } from '../types/message';
import { OnlineStatus } from '../types/enums';

interface GetConversationResponse {
  data: IMessage[];
}

interface GetGroupConversationResponse {
  data: IMessage[];
}

interface AddReactionResponse {
  data: IMessage;
}

interface EditMessageResponse {
  data: IMessage;
}

interface DeleteMessageResponse {
  message: string;
}

interface SearchMessagesResponse {
  data: IMessage[];
}

interface UpdateOnlineStatusResponse {
  message: string;
  onlineStatus: OnlineStatus;
}

interface RetrieveOnlineStatusResponse {
  onlineStatus: OnlineStatus;
}

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/messages`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const csrfToken = (getState() as RootState).csrf.csrfToken;
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Get conversation between two users
    getConversation: builder.query<IMessage[], string>({
      query: (participantId) => `/conversations/${participantId}`,
      transformResponse: (response: GetConversationResponse) => {
        return response.data.map((msg) => ({
          ...msg,
          _id: msg._id || `temp-id-${Date.now()}`, // Add fallback `_id`
          timestamp: new Date(msg.timestamp).toISOString(), // Ensure ISO format
        }));
      },
    }),

    // 2. Get conversation for a group
    getGroupConversation: builder.query<IMessage[], string>({
      query: (groupId) => `/groups/${groupId}/messages`,
      transformResponse: (response: GetGroupConversationResponse) => {
        return response.data.map((msg) => ({
          ...msg,
          _id: msg._id || `temp-id-${Date.now()}`, // Add fallback `_id`
          timestamp: new Date(msg.timestamp).toISOString(), // Ensure ISO format
        }));
      },
    }),

    // 3. Send a private message
    sendPrivateMessage: builder.mutation<IMessage, { receiver: string; content: string; fileUrl?: string }>({
      query: (body) => ({
        url: '/send',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        const validTimestamp = (timestamp: any): string => {
          return timestamp && !isNaN(Date.parse(timestamp))
            ? new Date(timestamp).toISOString()
            : new Date().toISOString();
        };

        return {
          ...response,
          _id: response._id || `temp-id-${Date.now()}`, // Add or generate `_id`
          timestamp: validTimestamp(response.timestamp),
        };
      },
    }),

    // 4. Send a group message
    sendGroupMessage: builder.mutation<IMessage, { groupId: string; content: string; fileUrl?: string }>({
      query: (body) => ({
        url: '/send',
        method: 'POST',
        body: { ...body, groupId: body.groupId }, // Include groupId in the request body
      }),
      transformResponse: (response: any) => {
        const validTimestamp = (timestamp: any): string => {
          return timestamp && !isNaN(Date.parse(timestamp))
            ? new Date(timestamp).toISOString()
            : new Date().toISOString();
        };

        return {
          ...response,
          _id: response._id || `temp-id-${Date.now()}`, // Add or generate `_id`
          timestamp: validTimestamp(response.timestamp),
        };
      },
    }),

    // 5. Add a reaction to a message
    addReaction: builder.mutation<IMessage, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({
        url: '/reactions',
        method: 'POST',
        body: { messageId, emoji },
      }),
      transformResponse: (response: AddReactionResponse) => response.data,
    }),

    // 6. Edit a message
    editMessage: builder.mutation<IMessage, { messageId: string; newContent: string }>({
      query: ({ messageId, newContent }) => ({
        url: `/messages/${messageId}/edit`,
        method: 'PUT',
        body: { newContent },
      }),
      transformResponse: (response: EditMessageResponse) => response.data,
    }),

    // 7. Delete a message
    deleteMessage: builder.mutation<string, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}/delete`,
        method: 'DELETE',
      }),
      transformResponse: (response: DeleteMessageResponse) => response.message,
    }),

    // 8. Search messages
    searchMessages: builder.query<IMessage[], { query: string; page?: number; limit?: number; startDate?: string; endDate?: string }>({
      query: ({ query, page = 1, limit = 20, startDate, endDate }) => {
        const params = new URLSearchParams({ query, page: page.toString(), limit: limit.toString() });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/search?${params.toString()}`;
      },
      transformResponse: (response: SearchMessagesResponse) => {
        return response.data.map((msg) => ({
          ...msg,
          _id: msg._id || `temp-id-${Date.now()}`, // Add fallback `_id`
          timestamp: new Date(msg.timestamp).toISOString(), // Ensure ISO format
        }));
      },
    }),

    // 9. Update online status
    updateOnlineStatus: builder.mutation<UpdateOnlineStatusResponse, { userId: string; onlineStatus: OnlineStatus }>({
      query: ({ userId, onlineStatus }) => ({
        url: `/online/${userId}`,
        method: 'PUT',
        body: { onlineStatus },
      }),
      transformResponse: (response: UpdateOnlineStatusResponse) => response,
    }),

    // 10. Retrieve online status
    retrieveOnlineStatus: builder.query<RetrieveOnlineStatusResponse, string>({
      query: (userId) => `/online/${userId}`,
      transformResponse: (response: RetrieveOnlineStatusResponse) => response,
    }),
    // 11. Mark a message as read
     
     markMessagesAsRead: builder.mutation<void, string>({
      query: (participantId) => ({
        url: `/conversations/${participantId}/read`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetGroupConversationQuery, // Hook for group conversations
  useSendPrivateMessageMutation,
  useSendGroupMessageMutation,
  useAddReactionMutation, // Hook for adding reactions
  useEditMessageMutation, // Hook for editing messages
  useDeleteMessageMutation, // Hook for deleting messages
  useSearchMessagesQuery, // Hook for searching messages
  useUpdateOnlineStatusMutation, // Hook for updating online status
  useRetrieveOnlineStatusQuery, // Hook for retrieving online status
  useMarkMessagesAsReadMutation,
} = messageApi;
