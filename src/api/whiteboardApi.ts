import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import { WhiteboardTool } from '../types/whiteboard';


// In your whiteboardApi.ts or wherever IStroke is defined
// In your whiteboardApi.ts or a shared types file:

export interface IStroke {
  type: WhiteboardTool;  // use the new type
  color: string;
  points: { x: number; y: number }[];
  lineWidth: number;
  fontFamily?: string;
  fontSize?: number;
  text?: string;
  // ...
}

export interface IWhiteboard {
  _id: string;
  title: string;
  description?: string;
  owner: string; // or { _id: string; name: string }
  participants: string[]; // or user objects
  strokes: IStroke[];
  snapshots: any[];
  version: number;
  createdAt: string;
  updatedAt: string;
  
}

interface EditWhiteboardPayload {
  id: string;
  data: {
    title?: string;
    description?: string;
  };
}


interface CreateWhiteboardPayload {
  ownerId: string;
  title: string;
  description?: string;
}

interface UpdateWhiteboardPayload {
  strokes: IStroke[];
  createSnapshot?: boolean;
}

interface PaginatedSnapshots {
  snapshots: any[]; // or define Snapshot interface
  total: number;
  page: number;
  limit: number;
}

interface PaginatedParticipants {
  participants: any[]; // or define Participant interface
  total: number;
  page: number;
  limit: number;
}


export const whiteboardApi = createApi({
  reducerPath: 'whiteboardApi',

  // **Use your custom base query here**
  baseQuery: customBaseQuery,

  tagTypes: ['Whiteboard'],
  endpoints: (builder) => ({
    // CREATE
    createWhiteboard: builder.mutation<IWhiteboard, CreateWhiteboardPayload>({
      query: (body) => ({
        url: '/whiteboards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Whiteboard'],
    }),

    editWhiteboard: builder.mutation<IWhiteboard, EditWhiteboardPayload>({
      query: ({ id, data }) => ({
        url: `/whiteboards/${id}`,
        method: 'PATCH',
        // Now we send `data` as the body
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Whiteboard', id }],
    }),
    

    // GET by ID
    getWhiteboard: builder.query<IWhiteboard, string>({
      query: (id) => `/whiteboards/${id}`,
      providesTags: (result, error, id) => [{ type: 'Whiteboard', id }],
    }),

    // UPDATE strokes
    updateWhiteboard: builder.mutation<
      IWhiteboard,
      { id: string; data: UpdateWhiteboardPayload }
    >({
      query: ({ id, data }) => ({
        url: `/whiteboards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Whiteboard', id: arg.id },
      ],
    }),

    // ADD PARTICIPANT
    addParticipant: builder.mutation<IWhiteboard, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/whiteboards/${id}/participants`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Whiteboard', id: arg.id },
      ],
    }),

    // REMOVE PARTICIPANT
    removeParticipant: builder.mutation<IWhiteboard, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/whiteboards/${id}/participants`,
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Whiteboard', id: arg.id },
      ],
    }),

    // REVERT
    revertToSnapshot: builder.mutation<IWhiteboard, { id: string; snapshotId: string }>({
      query: ({ id, snapshotId }) => ({
        url: `/whiteboards/${id}/revert`,
        method: 'PUT',
        body: { snapshotId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Whiteboard', id: arg.id },
      ],
    }),

    fetchMyWhiteboards: builder.query<IWhiteboard[], void>({
      query: () => '/whiteboards/mine', // no userId param needed
    }),

    // DELETE
    deleteWhiteboard: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/whiteboards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Whiteboard', id }],
    }),
        // DELETE a snapshot
        deleteSnapshot: builder.mutation<
        { message: string; whiteboard: IWhiteboard },
        { id: string; snapshotId: string }
      >({
        query: ({ id, snapshotId }) => ({
          url: `/whiteboards/${id}/snapshots/${snapshotId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Whiteboard', id: arg.id },
        ],
      }),
  
      // GET Snapshots (paginated)
      getBoardSnapshots: builder.query<
        PaginatedSnapshots,
        { id: string; page: number; limit: number }
      >({
        query: ({ id, page, limit }) =>
          `/whiteboards/${id}/snapshots?page=${page}&limit=${limit}`,
        // optional providesTags if you want caching/invalidation
      }),
  
      // GET Participants (paginated)
      getBoardParticipants: builder.query<
        PaginatedParticipants,
        { id: string; page: number; limit: number }
      >({
        query: ({ id, page, limit }) =>
          `/whiteboards/${id}/participants?page=${page}&limit=${limit}`,
      }),
    }),
  });


export const {
  useCreateWhiteboardMutation,
  useFetchMyWhiteboardsQuery,
  useGetWhiteboardQuery,
  useUpdateWhiteboardMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useRevertToSnapshotMutation,
  useDeleteWhiteboardMutation,
  useEditWhiteboardMutation,

  // DELETE a snapshot
  useDeleteSnapshotMutation,
  // GET Snapshots (paginated)
  useGetBoardSnapshotsQuery,
  // GET Participants (paginated)
  useGetBoardParticipantsQuery,
} = whiteboardApi;
