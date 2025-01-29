import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../api/baseQuery';

export interface IStroke {
  type: string;
  color: string;
  points: { x: number; y: number }[];
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

interface CreateWhiteboardPayload {
  ownerId: string;
  title: string;
  description?: string;
}

interface UpdateWhiteboardPayload {
  strokes: IStroke[];
  createSnapshot?: boolean;
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

    // DELETE
    deleteWhiteboard: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/whiteboards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Whiteboard', id }],
    }),
  }),
});

export const {
  useCreateWhiteboardMutation,
  useGetWhiteboardQuery,
  useUpdateWhiteboardMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useRevertToSnapshotMutation,
  useDeleteWhiteboardMutation,
} = whiteboardApi;
