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
import { tasksApi} from './tasksApi';
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
 * Define the FetchCardsByBoardId Query Parameters
 */
interface FetchCardsByBoardIdParams {
  boardId: string;
  search?: string;
  progress?: number;
  startDateFrom?: string;
  startDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
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
  tagTypes: ['Card', 'List', 'Board'],
  endpoints: (builder) => ({
    /**
     * Basic Card CRUD
     */

          // Inside the cardApi endpoints
      fetchCardsByList: builder.query<ICard[], string>({
        query: (listId) => `/lists/${listId}/cards`,
        providesTags: (result, error, listId) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: 'Card' as const, id: _id })),
                { type: 'List', id: listId }, // Unique List tag
              ]
            : [{ type: 'List', id: listId }],
      }),

      createCard: builder.mutation<ICard, ICreateCardInput>({
        query: (body) => ({
          url: '/cards',
          method: 'POST',
          body,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Card', id: arg.list },
          { type: 'Board', id: arg.boardId }, // <--- add this line
        ],
        // createCard in cardApi
        onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
          try {
            const { data: newCard } = await queryFulfilled;
            // Now manually dispatch an invalidate to tasksApi
            dispatch(
              tasksApi.util.invalidateTags([{ type: 'Board', id: arg.boardId }])
            );
          } catch (err) {
            console.error(err);
          }
        },

      }),
      
     /**
     * Fetch Cards by Board ID with Filters and Pagination
     */
     fetchCardsByBoardId: builder.query<{
      data: ICard[];
      total: number;
      page: number;
      totalPages: number;
    }, FetchCardsByBoardIdParams>({
      query: ({ boardId, search, progress, startDateFrom, startDateTo, dueDateFrom, dueDateTo, page, limit }) => {
        const queryParams = new URLSearchParams();

        queryParams.append('boardId', boardId);
        if (search) queryParams.append('search', search);
        if (progress !== undefined && progress !== null) queryParams.append('progress', progress.toString());
        if (startDateFrom) queryParams.append('startDateFrom', startDateFrom);
        if (startDateTo) queryParams.append('startDateTo', startDateTo);
        if (dueDateFrom) queryParams.append('dueDateFrom', dueDateFrom);
        if (dueDateTo) queryParams.append('dueDateTo', dueDateTo);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());

        return {
          url: `/cards/boards/${boardId}/cards?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { boardId }) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Card' as const, id: _id })),
              { type: 'Card', id: `BOARD_${boardId}` },
            ]
          : [{ type: 'Card', id: `BOARD_${boardId}` }],
    }),
    
         // Fetch all cards for a board (no pagination)
    fetchAllCardsByBoardId: builder.query<ICard[], string>({
      query: (boardId) => `/cards/boards/${boardId}/all`,
      providesTags: (result, error, boardId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Card' as const, id: _id })),
              { type: 'Card', id: `BOARD_${boardId}` },
            ]
          : [{ type: 'Card', id: `BOARD_${boardId}` }],
    }),

    // Get Card by ID
    fetchCardById: builder.query<ICard, string>({
      query: (cardId) => `/cards/${cardId}`,
      providesTags: (result, error, cardId) => [{ type: 'Card', id: cardId }],
    }),

    updateGantCard: builder.mutation<ICard, Partial<ICard> & Pick<ICard, '_id'>>({
      query: ({ _id, startDate, dueDate, progress }) => ({
        url: `/cards/${_id}/gantt`,
        method: 'PUT',
        body: {
          startDate: startDate ?? null,
          dueDate: dueDate ?? null,
          progress: progress ?? 0, // Ensure progress is sent as a number
        },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'Card', id: _id }],
    }),


    updateCard: builder.mutation<ICard, Partial<ICard> & Pick<ICard, '_id'> & { boardId?: string }>({
      query: ({ _id, dueDate, ...patch }) => ({
        url: `/cards/${_id}`,
        method: 'PUT',
        body: {
          ...patch,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'Card', id: _id }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // 1) Optimistically update the card in the 'fetchCardById' cache
        const patchResult = dispatch(
          cardApi.util.updateQueryData('fetchCardById', arg._id, (draft) => {
            Object.assign(draft, arg);
          })
        );
    
        try {
          // 2) Wait for the server response
          const { data: updatedCard } = await queryFulfilled;
          if (updatedCard.boardId) {
            dispatch(tasksApi.util.invalidateTags([{ type: 'Board', id: updatedCard.boardId }]));
          }

          
        } catch (error) {
          // Revert the optimistic update if the request fails
          patchResult.undo();
          console.error('Failed to update cache:', error);
        }
      },
    }),



    deleteCard: builder.mutation<
    { message: string; boardId?: string }, // <-- We expect the server might return { message, boardId }
    { cardId: string; boardId?: string; listId?: string }
  >({
    query: ({ cardId }) => ({
      url: `/cards/${cardId}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'Card', id: 'LIST' }],
    async onQueryStarted({ cardId, boardId, listId }, { dispatch, queryFulfilled }) {
      // 1) Optionally do an optimistic update in 'fetchCardById' or 'fetchCardsByList' if you want
      if (listId) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData('fetchCardById', cardId, (draft) => {
            // e.g., remove or set empty
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
  
      try {
        // 2) Wait for the server response
        const { data } = await queryFulfilled;
  
        // 3) If the server returns boardId, or if we have boardId from arg, use that
        const finalBoardId = data.boardId || boardId;
        if (finalBoardId) {
          // 4) Invalidate tasksApi's "Board" so it re-fetches
          dispatch(tasksApi.util.invalidateTags([{ type: 'Board', id: finalBoardId }]));
        }
      } catch (err) {
        console.error('Delete Card error:', err);
      }
    },
  }),
  
  assignUserToCard: builder.mutation<
  { message: string; boardId?: string },
  { cardId: string; userId: string }
>({
  query: ({ cardId, userId }) => ({
    url: `/cards/${cardId}/assign`,
    method: 'POST',
    body: { userId },
  }),
  // If you want to automatically re-fetch the board, do:
  // invalidatesTags: (result, error, { boardId }) => [...],
  async onQueryStarted({ cardId, userId }, { dispatch, queryFulfilled }) {
    // 1) Optimistically update the card in your 'fetchCardById' or similar query
    const patchResult = dispatch(
      cardApi.util.updateQueryData('fetchCardById', cardId, (draftCard) => {
        if (!draftCard) return;
        // Only update if user not already in assignees
        if (!draftCard.assignees.includes(userId as any)) {
          draftCard.assignees.push(userId as any);
        }
      })
    );

    try {
      const { data } = await queryFulfilled;
      // Optionally re-fetch the board if data.boardId
      // dispatch(tasksApi.util.invalidateTags([{ type: 'Board', id: data.boardId }]));
    } catch (error) {
      // Revert local change if server call fails
      patchResult.undo();
    }
  },
}),

// e.g. in cardApi or tasksApi
unassignUserFromCard: builder.mutation<
  { message: string; boardId?: string },
  { cardId: string; userId: string }
>({
  query: ({ cardId, userId }) => ({
    url: `/cards/${cardId}/unassign`,
    method: 'DELETE', // or 'POST' if you used a POST route
    body: { userId },
  }),
  async onQueryStarted({ cardId, userId }, { dispatch, queryFulfilled }) {
    // Optionally do an optimistic update if you have fetchCardById
    const patchResult = dispatch(
      cardApi.util.updateQueryData('fetchCardById', cardId, (draftCard) => {
        if (!draftCard) return;
        // remove user from assignees if it exists
        draftCard.assignees = draftCard.assignees.filter((id) => id !== userId);
      })
    );

    try {
      const { data } = await queryFulfilled;
      // If the server returns boardId, do something (re-fetch board, etc.)
      // dispatch(tasksApi.util.invalidateTags([{ type: 'Board', id: data.boardId }]));
    } catch (err) {
      patchResult.undo();
    }
  },
}),

    
        // Like a Card
        likeCard: builder.mutation<ICard, { cardId: string }>({
          query: ({ cardId }) => ({
            url: `/cards/${cardId}/like`,
            method: 'POST',
          }),
          invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
          async onQueryStarted({ cardId }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
              cardApi.util.updateQueryData('fetchCardById', cardId, (draft) => {
                if (draft && !draft.likes.includes(cardId)) {
                  draft.likes.push(cardId); // Optimistically add the cardId to the likes
                }
              })
            );
        
            try {
              await queryFulfilled; // Await backend response
            } catch (error) {
              patchResult.undo(); // Rollback if the mutation fails
              console.error('Failed to like card:', error);
            }
          },
        }),
        
  
      // Unlike a Card
      unlikeCard: builder.mutation<ICard, { cardId: string }>({
        query: ({ cardId }) => ({
          url: `/cards/${cardId}/unlike`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
        async onQueryStarted({ cardId }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            cardApi.util.updateQueryData('fetchCardById', cardId, (draft) => {
              if (draft) {
                draft.likes = draft.likes.filter((id) => id !== cardId); // Remove cardId from likes
              }
            })
          );
      
          try {
            await queryFulfilled;
          } catch (error) {
            patchResult.undo(); // Revert if the mutation fails
            console.error('Failed to unlike card:', error);
          }
        },
      }),
      

  
      // Add Watcher to Card
      addWatcherToCard: builder.mutation<ICard, { cardId: string; userId: string }>({
        query: ({ cardId, userId }) => ({
          url: `/cards/${cardId}/watchers`,
          method: 'POST',
          body: { userId },
        }),
        invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
        async onQueryStarted({ cardId, userId }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            cardApi.util.updateQueryData('fetchCardById', cardId, (draft) => {
              if (draft && !draft.watchers.includes(userId)) {
                draft.watchers.push(userId); // Optimistically add the user to watchers
              }
            })
          );
      
          try {
            await queryFulfilled;
          } catch (error) {
            patchResult.undo(); // Revert changes if mutation fails
            console.error('Failed to add watcher:', error);
          }
        },
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
     
    /* -----------------------------------------------------------
       SUB-TASK ENDPOINTS
    ----------------------------------------------------------- */

    /**
     * Sub-Task Endpoints by ID
     */
    
    // Add Sub-Task
    // 1) Add Sub-Task
      addSubTask: builder.mutation<ICard, { cardId: string; subTask: ISubTaskInput }>({
        query: ({ cardId, subTask }) => ({
          url: `/cards/${cardId}/subtasks`,
          method: 'POST',
          body: subTask,
        }),
        // invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
        async onQueryStarted({ cardId, subTask }, { dispatch, queryFulfilled }) {
          // Optimistically update subTasks in the local "fetchCardById" cache
          const patchResult = dispatch(
            cardApi.util.updateQueryData('fetchCardById', cardId, (draftCard) => {
              if (!draftCard.subTasks) {
                draftCard.subTasks = [];
              }
              // Insert at the end (or start)
              draftCard.subTasks.push({
                id: crypto.randomUUID(), // temporary ID
                title: subTask.title,
                completed: subTask.completed ?? false,
                dueDate: subTask.dueDate ? new Date(subTask.dueDate) : undefined,
                assignee: undefined, // or subTask.assignee
              });
            })
          );
          try {
            await queryFulfilled; // If the server returns the new subtask
          } catch {
            patchResult.undo(); // revert if the mutation fails
          }
        },
      }),

      
      // Fetch Sub-Task by ID
      fetchSubTaskById: builder.query<ISubTask, { cardId: string; subTaskId: string }>({
        query: ({ cardId, subTaskId }) => `/cards/${cardId}/subtasks/${subTaskId}`,
        providesTags: (result, error, { subTaskId }) => [{ type: 'Card', id: subTaskId }],
      }),
      
     updateSubTaskById: builder.mutation<ICard, { cardId: string; subTaskId: string; updates: Partial<ISubTaskInput> }>({
  query: ({ cardId, subTaskId, updates }) => ({
    url: `/cards/${cardId}/subtasks/${subTaskId}`,
    method: 'PUT',
    body: updates,
  }),
  async onQueryStarted({ cardId, subTaskId, updates }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      cardApi.util.updateQueryData('fetchCardById', cardId, (draftCard) => {
        if (!draftCard.subTasks) return;
        const existing = draftCard.subTasks.find((s) => s.id === subTaskId);
        if (existing) {
          if (updates.title !== undefined) existing.title = updates.title;
          if (updates.completed !== undefined) existing.completed = updates.completed;
          if (updates.dueDate !== undefined) existing.dueDate = updates.dueDate; // if string
          if (updates.assignee !== undefined) existing.assignee = updates.assignee as any;
        }
      })
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
}),


      // Delete Sub-Task by ID
      // 3) Delete Sub-Task
        deleteSubTaskById: builder.mutation<ICard, { cardId: string; subTaskId: string }>({
          query: ({ cardId, subTaskId }) => ({
            url: `/cards/${cardId}/subtasks/${subTaskId}`,
            method: 'DELETE',
          }),
          async onQueryStarted({ cardId, subTaskId }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
              cardApi.util.updateQueryData('fetchCardById', cardId, (draftCard) => {
                if (!draftCard.subTasks) return;
                draftCard.subTasks = draftCard.subTasks.filter((s) => s.id !== subTaskId);
              })
            );
            try {
              await queryFulfilled;
            } catch {
              patchResult.undo();
            }
          },
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
  useFetchCardsByListQuery,
  useUpdateGantCardMutation,
  useFetchCardsByBoardIdQuery,
  useFetchAllCardsByBoardIdQuery,

  // Assign user
  useAssignUserToCardMutation,
  useUnassignUserFromCardMutation,

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
