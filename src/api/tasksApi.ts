// src/api/tasksApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IBoard,
  IList,

  IComment,
  ILabel,
  IAttachment,
  IActivity,
  IUpdateListInput,
  IUpdateBoardListsInput,
  CreateLabelInput,
  UpdateLabelInput,
} from '../types/task';
import { IInvitation } from '../types/invitation'; 
import { customBaseQuery } from './baseQuery';
import { IUser } from '../types/user';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: customBaseQuery, // Use the custom baseQuery
  tagTypes: [
    'Board',
    'List',
    'Card',
    'Comment',
    'Label',
    'Attachment',
    'Activity',
    'BoardMembership',
    'Invitation',
  ],
  endpoints: (builder) => ({
    /**
     * #### Board Endpoints
     */
    createBoard: builder.mutation<IBoard, { name: string; description?: string; teamId: string }>({
      query: (body) => ({
        url: '/boards',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Board', id: 'LIST' }],
    }),
    

    fetchAllBoards: builder.query<IBoard[], void>({
      query: () => '/boards',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Board' as const, id: _id })),
              { type: 'Board', id: 'LIST' },
            ]
          : [{ type: 'Board', id: 'LIST' }],
    }),

    // Fetch a Board by ID
    fetchBoardById: builder.query<IBoard, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: 'Board', id }],
      transformResponse: (response: IBoard) => {
        response.lists.sort((a, b) => a.position - b.position); // Ensure lists are ordered by position
        return response;
      },
    }),

    // Update a Board
    updateBoard: builder.mutation<IBoard, Partial<IBoard> & Pick<IBoard, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `/boards/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'Board', id: _id }],
    }),

    // Add a new mutation for updating board's lists order
    updateBoardLists: builder.mutation<IBoard, IUpdateBoardListsInput>({
      query: ({ _id, lists }) => ({
        url: `/boards/${_id}/lists`,
        method: 'PUT',
        body: { lists },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'Board', id: _id }],
    }),

    // Delete a Board
    deleteBoard: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Board', id: 'LIST' }],
    }),

    updateListHeader: builder.mutation<IList, { listId: string; header: string }>({
      query: ({ listId, header }) => ({
        url: `/lists/${listId}/header`,
        method: 'PUT',
        body: { header },
      }),
      invalidatesTags: (result, error, { listId }) => [{ type: 'List', id: listId }],
    }),
    
    
    updateHeader: builder.mutation<IList, { listId: string; header: string }>({
      query: ({ listId, header }) => ({
        url: `/boards/lists/header`,
        method: 'PUT',
        body: { listId, newHeader: header },
      }),
      invalidatesTags: (result, error, { listId }) => [{ type: 'List', id: listId }],
    }),

    /**
     * #### List Endpoints
     */

    // Create a new List
    createList: builder.mutation<IList, Partial<IList>>({
      query: (body) => ({
        url: '/lists',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'List', id: 'LIST' }],
    }),

    // Fetch a List by ID
    fetchListById: builder.query<IList, string>({
      query: (id) => `/lists/${id}`,
      providesTags: (result, error, id) => [{ type: 'List', id }],
    }),

    // Update a List
    updateList: builder.mutation<IList, IUpdateListInput>({
      query: ({ _id, ...patch }) => ({
        url: `/lists/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'List', id: _id }],
    }),

    // Delete a List
    deleteList: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'List', id: 'LIST' }],
    }),

    /**
     * #### Comment Endpoints
     */

    // Create a new Comment
    createComment: builder.mutation<IComment, { cardId: string; content: string; parentCommentId?: string }>({
        query: ({ cardId, content, parentCommentId }) => ({
          url: parentCommentId ? `/comments/${parentCommentId}/replies` : '/comments',
          method: 'POST',
          body: parentCommentId ? { cardId, content } : { cardId, content },
        }),
        invalidatesTags: (result, error, { parentCommentId }) =>
          parentCommentId ? [{ type: 'Comment', id: parentCommentId }] : [{ type: 'Comment', id: 'LIST' }],
      }),
  
      // Edit a Comment
      editComment: builder.mutation<IComment, { commentId: string; content: string }>({
        query: ({ commentId, content }) => ({
          url: `/comments/${commentId}`,
          method: 'PUT',
          body: { content },
        }),
        invalidatesTags: (result, error, { commentId }) => [{ type: 'Comment', id: commentId }],
      }),
  
      // Delete a Comment
      deleteComment: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `/comments/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
      }),
  
      // Toggle Like on a Comment
      toggleLikeComment: builder.mutation<IComment, string>({
        query: (commentId) => ({
          url: `/comments/${commentId}/like`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, commentId) => [{ type: 'Comment', id: commentId }],
      }),
  
      // Create a Reply to a Comment
      createReply: builder.mutation<IComment, { cardId: string; parentCommentId: string; content: string }>({
        query: ({ cardId, parentCommentId, content }) => ({
          url: `/comments/${parentCommentId}/replies`,
          method: 'POST',
          body: { cardId, content },
        }),
        invalidatesTags: (result, error, { parentCommentId }) => [{ type: 'Comment', id: parentCommentId }],
      }),
  
      // Fetch Comments for a Card
      fetchComments: builder.query<IComment[], string>({
        query: (cardId) => `/comments/${cardId}/comments`,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: 'Comment' as const, id: _id })),
                { type: 'Comment', id: 'LIST' },
              ]
            : [{ type: 'Comment', id: 'LIST' }],
      }),
  
    // Create a new Label
    createLabel: builder.mutation<ILabel, CreateLabelInput>({
      query: (body) => ({
        url: '/labels',
        method: 'POST',
        body: {
          name: body.name,
          color: body.color,
          boardId: body.boardId, // Correctly sending 'boardId'
        },
      }),
      invalidatesTags: [{ type: 'Label', id: 'LIST' }],
    }),

    // Delete a Label
    deleteLabel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/labels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Label', id: 'LIST' }],
    }),

    // Get a single Label by ID
    getLabelById: builder.query<ILabel, string>({
      query: (id) => `/labels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Label', id }],
    }),

    // Get Labels by Board
    getLabelsByBoard: builder.query<ILabel[], string>({
      query: (boardId) => `/labels/board/${boardId}`,
      providesTags: (result, error, boardId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Label' as const, id: _id })),
              { type: 'Label', id: 'LIST' },
            ]
          : [{ type: 'Label', id: 'LIST' }],
    }),

    // Update a Label
 
        updateLabel: builder.mutation<ILabel, UpdateLabelInput>({
          query: ({ _id, ...patch }) => ({
            url: `/labels/${_id}`, // Use _id instead of labelId
            method: 'PUT',
            body: patch,
          }),
          invalidatesTags: (result, error, { _id }) => [{ type: 'Label', id: _id }], // Use _id
        }),

  
        /**
     * #### Attachment Endpoints
     */

    /**
     * Upload a single attachment
     */
    uploadSingleAttachment: builder.mutation<IAttachment, { cardId: string; file: File }>({
        query: ({ cardId, file }) => {
          const formData = new FormData();
          formData.append('cardId', cardId);
          formData.append('file', file);
  
          return {
            url: '/attachments/single',
            method: 'POST',
            body: formData,
          };
        },
        invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
      }),
      // Fetch Attachments for a Card
      fetchAttachmentsByCard: builder.query<IAttachment[], string>({
        query: (cardId) => `/attachments/${cardId}`,
        providesTags: (result, error, cardId) =>
            result
                ? [
                      ...result.map(({ _id }) => ({ type: 'Attachment' as const, id: _id })),
                      { type: 'Attachment', id: cardId },
                  ]
                : [{ type: 'Attachment', id: cardId }],
    }),
    
      /**
       * Upload multiple attachments
       */
      uploadMultipleAttachments: builder.mutation<
        IAttachment[],
        { cardId: string; files: File[] }
      >({
        query: ({ cardId, files }) => {
          const formData = new FormData();
          formData.append('cardId', cardId);
          files.forEach((file) => formData.append('files', file));
  
          return {
            url: '/attachments/multiple',
            method: 'POST',
            body: formData,
          };
        },
        invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
      }),
  
      /**
       * Delete an attachment
       */
      deleteAttachment: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `/attachments/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
      }),
  
    /**
     * #### Activity Endpoints
     */

    // Fetch Activities for a Board/List/Card

    fetchActivities: builder.query<IActivity[], { boardId?: string; listId?: string; cardId?: string }>({
        query: ({ boardId, listId, cardId }) => {
        let url = '/activities';
        const params = new URLSearchParams();
        if (boardId) params.append('boardId', boardId);
        if (listId) params.append('listId', listId);
        if (cardId) params.append('cardId', cardId);
        if (params.toString()) url += `?${params.toString()}`;
        return url;
        },
        providesTags: (result) =>
        result
            ? [
                ...result.map(({ _id }) => ({ type: 'Activity' as const, id: _id })),
                { type: 'Activity', id: 'LIST' },
            ]
            : [{ type: 'Activity', id: 'LIST' }],
    }),



        getActivityById: builder.query<IActivity, string>({
            query: (activityId) => `/activities/${activityId}`,
            providesTags: (result, error, activityId) => [{ type: 'Activity', id: activityId }],
        }),

        deleteActivity: builder.mutation<{ message: string }, string>({
            query: (activityId) => ({
              url: `/activities/${activityId}`,
              method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Activity', id: 'LIST' }],
          }),
          
    // Inside endpoints in tasksApi.ts

    assignUser: builder.mutation<{ message: string }, { userId: string; boardId: string }>({
      query: ({ userId, boardId }) => ({
        url: `/boards/${boardId}/assign`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { boardId }) => [{ type: 'Board', id: boardId }],
    }),

    // Assign User to Card
    assignUserToCard: builder.mutation<{ message: string }, { cardId: string; userId: string }>({
      query: ({ cardId, userId }) => ({
        url: `/cards/${cardId}/assign`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),

    /**
     * Board Membership Endpoints
     */

    // 1) Fetch Board Members
    fetchBoardMembers: builder.query<IUser[], string>({
        // boardId is the argument
        query: (boardId) => ({
          url: `/board-memberships/${boardId}/members`,
          method: 'GET',
        }),
        providesTags: (result, error, boardId) =>
          result
            ? [
                ...result.map(({ _id }) => ({
                  type: 'BoardMembership' as const,
                  id: _id,
                })),
                { type: 'BoardMembership', id: `BOARD-${boardId}` },
              ]
            : [{ type: 'BoardMembership', id: `BOARD-${boardId}` }],
      }),
  
      // 2) Add a member to a board
      addMemberToBoard: builder.mutation<
        { _id: string; name: string /* or your IBoard fields */ },
        { boardId: string; userId: string }
      >({
        query: ({ boardId, userId }) => ({
          url: `/board-memberships/${boardId}/members`,
          method: 'POST',
          body: { userId },
        }),
        invalidatesTags: (result, error, { boardId }) => [
          { type: 'BoardMembership', id: `BOARD-${boardId}` },
        ],
      }),
  
      // 3) Remove a member from a board
      removeMemberFromBoard: builder.mutation<
        { _id: string; name: string /* or IBoard fields */ },
        { boardId: string; userId: string }
      >({
        query: ({ boardId, userId }) => ({
          url: `/board-memberships/${boardId}/members/${userId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { boardId }) => [
          { type: 'BoardMembership', id: `BOARD-${boardId}` },
        ],
      }),

       // 1) Set Board Team
    setBoardTeam: builder.mutation<IBoard, { boardId: string; teamId: string; syncMembers?: boolean }>({
      query: ({ boardId, teamId, syncMembers }) => ({
        url: `/board-memberships/${boardId}/team`,
        method: 'POST',
        body: {
          teamId,
          syncMembers: typeof syncMembers === 'boolean' ? syncMembers : true,
        },
      }),
      invalidatesTags: (result, error, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),

    // 2) Remove Board Team
    removeBoardTeam: builder.mutation<IBoard, { boardId: string; clearMembers?: boolean }>({
      query: ({ boardId, clearMembers }) => ({
        url: `/board-memberships/${boardId}/team`,
        method: 'DELETE',
        body: {
          clearMembers: typeof clearMembers === 'boolean' ? clearMembers : true,
        },
      }),
      invalidatesTags: (result, error, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),

     /** Create a new Invitation */
     createInvitation: builder.mutation<
     // Response shape from the backend
     {
       message: string;
       invitation: IInvitation;
       inviteLink: string;
     },
     // What we send in the request
     {
       boardId: string;
       invitedEmail: string;
       role: string; // e.g. "subContractor" or whatever your role might be
     }
   >({
     query: (body) => ({
       url: '/invitations',
       method: 'POST',
       body,
     }),
     invalidatesTags: ['Invitation'],
   }),

   /** Accept an Invitation */
   acceptInvitation: builder.mutation<
     // Response shape
     {
       message: string;
       boardId: string;
       userId: string;
     },
     // What the frontend sends
     {
       token: string;
       name?: string;     // if new user
       password?: string; // if new user
     }
   >({
     query: (body) => ({
       url: '/invitations/accept',
       method: 'POST',
       body,
     }),
     // For many apps, you might not need to invalidate an “Invitation” here
     invalidatesTags: [],
   }),

   /** Decline an Invitation */
   declineInvitation: builder.mutation<
   { message: string; invitationId?: string },
   { token: string; reason?: string }
 >({
   query: (body) => ({
     url: '/invitations/decline',
     method: 'POST',
     body,
   }),
   invalidatesTags: [],
 }),
 

  }),
});

// Export hooks for usage in components
export const {
  // Board Hooks
  useCreateBoardMutation,
  useFetchBoardByIdQuery,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useFetchAllBoardsQuery,
  useUpdateBoardListsMutation,

  // List Hooks
  useCreateListMutation,
  useFetchListByIdQuery,
  useUpdateListMutation,
  useDeleteListMutation,
  useUpdateListHeaderMutation,


  // Comment Hooks
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeCommentMutation,
  useCreateReplyMutation,
  useFetchCommentsQuery,

  // Label Hooks
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useGetLabelByIdQuery,
  useGetLabelsByBoardQuery,
  useUpdateLabelMutation,

  // Attachment Hooks
 
  useDeleteAttachmentMutation,
  useUploadSingleAttachmentMutation,
  useUploadMultipleAttachmentsMutation,
  useFetchAttachmentsByCardQuery,

  // Activity Hooks
  useFetchActivitiesQuery,
    useGetActivityByIdQuery,
    useDeleteActivityMutation,

  useAssignUserMutation,
  useAssignUserToCardMutation,

  // Board Membership

  useFetchBoardMembersQuery,
  useAddMemberToBoardMutation,
  useRemoveMemberFromBoardMutation,
  useSetBoardTeamMutation,
  useRemoveBoardTeamMutation,

  // Invitation Hooks
  useCreateInvitationMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,

} = tasksApi;
