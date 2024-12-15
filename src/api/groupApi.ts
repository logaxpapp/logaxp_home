// src/api/groupApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { IGroup } from '../types/group';
import { IGroupMessage } from '../types/groupMessage';

export const groupApi = createApi({
  reducerPath: 'groupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/groups`,
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers, { getState }) => {
      const csrfToken = (getState() as RootState).csrf.csrfToken;
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      return headers;
    },
  }),
  tagTypes: ['Group', 'GroupMessages'], // For cache invalidation
  endpoints: (builder) => ({
    // Get groups for the authenticated user
    getUserGroups: builder.query<
      { data: IGroup[]; total: number; page: number; limit: number },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: `/?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => ({
        data: response.data as IGroup[],
        total: response.total,
        page: response.page,
        limit: response.limit,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Group' as const, id: _id })),
              { type: 'Group', id: 'LIST' },
            ]
          : [{ type: 'Group', id: 'LIST' }],
    }),

    // Create a new group
    createGroup: builder.mutation<IGroup, { name: string; members: string[] }>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => response.data as IGroup,
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),

    // Add a member to a group
    addMember: builder.mutation<IGroup, { groupId: string; memberId: string }>({
      query: ({ groupId, memberId }) => ({
        url: `/${groupId}/members`,
        method: 'POST',
        body: { memberId },
      }),
      transformResponse: (response: any) => response.data as IGroup,
      invalidatesTags: (result, error, { groupId }) => [{ type: 'Group', id: groupId }],
    }),

    // Remove a member from a group
    removeMember: builder.mutation<IGroup, { groupId: string; memberId: string }>({
      query: ({ groupId, memberId }) => ({
        url: `/${groupId}/members/${memberId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => response.data as IGroup,
      invalidatesTags: (result, error, { groupId }) => [{ type: 'Group', id: groupId }],
    }),

    updateGroup: builder.mutation<void, { groupId: string; name?: string; members?: string[] }>({
      query: ({ groupId, ...body }) => ({
        url: `/${groupId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteGroup: builder.mutation<void, string>({
      query: (groupId) => ({
        url: `/${groupId}`,
        method: 'DELETE',
      }),
    }),

    // Get group details
    getGroupDetails: builder.query<IGroup, string>({
      query: (groupId) => `/${groupId}`,
      transformResponse: (response: any) => response.data as IGroup,
      providesTags: (result, error, groupId) => [{ type: 'Group', id: groupId }],
    }),

    // Get group messages
    getGroupMessages: builder.query<IGroupMessage[], string>({
      query: (groupId) => `/${groupId}/messages`,
      transformResponse: (response: any) => response.data as IGroupMessage[],
      providesTags: (result, error, groupId) => [{ type: 'GroupMessages', id: groupId }],
    }),

    // Optionally, add more endpoints such as updating group info, deleting groups, etc.
  }),
});

export const {
  useGetUserGroupsQuery,
  useCreateGroupMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useGetGroupDetailsQuery,
  useGetGroupMessagesQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupApi;
