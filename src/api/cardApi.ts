// src/api/cardApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import {
  ICard,
  ICreateCardInput,
    ICustomField,
    ISubTask,
    ITimeLog,
} from '../types/task';

/**
 * Minimal Input Types for sub-tasks, time logs, custom fields, etc.
 */
export interface ISubTaskInput {
  title: string;
  dueDate?: string;     // Pass ISO string from frontend
  assignee?: string;    // userId as string
  completed?: boolean;
}

export interface ITimeLogInput {
  userId: string;       // userId as string
  start: string;        // ISO string
  end: string;          // ISO string
}

export interface ICustomFieldInput {
  key: string;
  value: string;
}

/**
 * A single slice for ALL Card endpoints:
 * - Basic CRUD
 * - Assign user
 * - Sub-Tasks
 * - Time Logs
 * - Custom Fields
 */
export const cardApi = createApi({
  reducerPath: 'cardApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Card'], // We'll use Card tags for invalidation
  endpoints: (builder) => ({
    /**
     * Basic Card CRUD
     */

    // Create Card
    createCard: builder.mutation<ICard, ICreateCardInput>({
        query: (body) => ({
          url: '/cards',
          method: 'POST',
          body,
        }),
        invalidatesTags: [{ type: 'Card', id: 'LIST' }],
      }),

    // Get Card by ID
    fetchCardById: builder.query<ICard, string>({
      query: (cardId) => `/cards/${cardId}`,
      providesTags: (result, error, cardId) => [{ type: 'Card', id: cardId }],
    }),

    // Update Card
    updateCard: builder.mutation<ICard, Partial<ICard> & Pick<ICard, '_id'>>({
        query: ({ _id, ...patch }) => ({
          url: `/cards/${_id}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: 'Card', id: _id }],
      }),

    // Delete Card
    deleteCard: builder.mutation<
      { message: string },
      { cardId: string; boardId?: string; listId?: string }
    >({
      query: ({ cardId }) => ({
        url: `/cards/${cardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Card', id: 'LIST' }],
      // If you want optimistic updates for removing from a list, do it here
      async onQueryStarted({ cardId, listId }, { dispatch, queryFulfilled }) {
        // Example if you want to optimistically remove from "fetchListById" cache
        if (listId) {
          const patchResult = dispatch(
            cardApi.util.updateQueryData('fetchCardById', cardId, (draft) => {
              // Not strictly needed unless you're caching Card data in that query
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        }
      },
    }),

    /**
     * Assign User to Card
     */
    assignUserToCard: builder.mutation<
      { message: string },
      { cardId: string; userId: string }
    >({
      query: ({ cardId, userId }) => ({
        url: `/cards/${cardId}/assign`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),
  
      // Like a Card
      likeCard: builder.mutation<ICard, { cardId: string }>({
        query: ({ cardId }) => ({
          url: `/cards/${cardId}/like`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
  
      // Unlike a Card
      unlikeCard: builder.mutation<ICard, { cardId: string }>({
        query: ({ cardId }) => ({
          url: `/cards/${cardId}/unlike`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),

  
      // Add Watcher to Card
      addWatcherToCard: builder.mutation<ICard, { cardId: string; userId: string }>({
        query: ({ cardId, userId }) => ({
          url: `/cards/${cardId}/watchers`,
          method: 'POST',
          body: { userId },
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
  
      // Remove Watcher from Card
      removeWatcherFromCard: builder.mutation<ICard, { cardId: string; userId: string }>({
        query: ({ cardId, userId }) => ({
          url: `/cards/${cardId}/watchers`,
          method: 'DELETE',
          body: { userId },
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      // Inside the cardApi endpoints
            fetchCardsByList: builder.query<ICard[], string>({
                query: (listId) => `/lists/${listId}/cards`, // Ensure your backend has this endpoint
                providesTags: (result, error, listId) => 
                result
                    ? [...result.map(({ _id }) => ({ type: 'Card' as const, id: _id })), { type: 'Card', id: 'LIST' }]
                    : [{ type: 'Card', id: 'LIST' }],
            }),

    /* -----------------------------------------------------------
       SUB-TASK ENDPOINTS
    ----------------------------------------------------------- */

    /**
     * Sub-Task Endpoints by ID
     */
    
    // Add Sub-Task
    addSubTask: builder.mutation<ICard, { cardId: string; subTask: ISubTaskInput }>({
        query: ({ cardId, subTask }) => ({
          url: `/cards/${cardId}/subtasks`,
          method: 'POST',
          body: subTask,
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      
      // Fetch Sub-Task by ID
      fetchSubTaskById: builder.query<ISubTask, { cardId: string; subTaskId: string }>({
        query: ({ cardId, subTaskId }) => `/cards/${cardId}/subtasks/${subTaskId}`,
        providesTags: (result, error, { subTaskId }) => [{ type: 'Card', id: subTaskId }],
      }),
      
      // Update Sub-Task by ID
      updateSubTaskById: builder.mutation<ICard, { cardId: string; subTaskId: string; updates: Partial<ISubTaskInput> }>({
        query: ({ cardId, subTaskId, updates }) => ({
          url: `/cards/${cardId}/subtasks/${subTaskId}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      
      // Delete Sub-Task by ID
      deleteSubTaskById: builder.mutation<ICard, { cardId: string; subTaskId: string }>({
        query: ({ cardId, subTaskId }) => ({
          url: `/cards/${cardId}/subtasks/${subTaskId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      

    /* -----------------------------------------------------------
       TIME LOG ENDPOINTS
    ----------------------------------------------------------- */

    logTime: builder.mutation<
      ICard,
      { cardId: string; userId: string; start: string; end: string }
    >({
      query: ({ cardId, userId, start, end }) => ({
        url: `/cards/${cardId}/timelogs`,
        method: 'POST',
        body: { userId, start, end },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),

    /* -----------------------------------------------------------
       CUSTOM FIELDS ENDPOINTS
    ----------------------------------------------------------- */
    /**
     * Add Custom Field
     */
    addCustomField: builder.mutation<ICard, { cardId: string; customField: ICustomFieldInput }>({
        query: ({ cardId, customField }) => ({
          url: `/cards/${cardId}/customfields`,
          method: 'POST',
          body: customField,
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      

    // Update Custom Field
    updateCustomField: builder.mutation<
      ICard,
      { cardId: string; fieldIndex: number; updates: Partial<ICustomFieldInput> }
    >({
      query: ({ cardId, fieldIndex, updates }) => ({
        url: `/cards/${cardId}/customfields/${fieldIndex}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),

    // Delete Custom Field
    deleteCustomField: builder.mutation<
      ICard,
      { cardId: string; fieldIndex: number }
    >({
      query: ({ cardId, fieldIndex }) => ({
        url: `/cards/${cardId}/customfields/${fieldIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),
      /**
       * Fetch Time Log by ID
       */
      fetchTimeLogById: builder.query<ITimeLog, { cardId: string; timeLogId: string }>({
        query: ({ cardId, timeLogId }) => `/cards/${cardId}/timelogs/${timeLogId}`,
        providesTags: (result, error, { timeLogId }) => [{ type: 'Card', id: timeLogId }],
      }),
  
      /**
       * Fetch Custom Field by ID
       */
      fetchCustomFieldById: builder.query<ICustomField, { cardId: string; customFieldId: string }>({
        query: ({ cardId, customFieldId }) => `/cards/${cardId}/customfields/${customFieldId}`,
        providesTags: (result, error, { customFieldId }) => [{ type: 'Card', id: customFieldId }],
      }),

      addLabelToCard: builder.mutation<ICard, { cardId: string; labelId: string }>({
        query: ({ cardId, labelId }) => ({
          url: `/cards/${cardId}/labels`,
          method: 'POST',
          body: { labelId },
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
      removeLabelFromCard: builder.mutation<ICard, { cardId: string; labelId: string }>({
        query: ({ cardId, labelId }) => ({
          url: `/cards/${cardId}/labels`,
          method: 'DELETE',
          body: { labelId },
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
      }),
  }),
});

// Export all hooks for usage in components
export const {
  // Basic Card CRUD
  useCreateCardMutation,
  useFetchCardByIdQuery,
  useUpdateCardMutation,
  useDeleteCardMutation,

  // Assign user
  useAssignUserToCardMutation,

  // Sub-Task Hooks
  useAddSubTaskMutation,
  useFetchSubTaskByIdQuery,
  useUpdateSubTaskByIdMutation,
  useDeleteSubTaskByIdMutation,

  // Time Logs
  useLogTimeMutation,
  useFetchTimeLogByIdQuery,

  // Custom Fields
  useAddCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
  useFetchCustomFieldByIdQuery,

    // Other Card endpoints
  useLikeCardMutation,
  useUnlikeCardMutation,
  useAddWatcherToCardMutation,
  useRemoveWatcherFromCardMutation,

  // Label endpoints
  useAddLabelToCardMutation,
  useRemoveLabelFromCardMutation,
} = cardApi;
