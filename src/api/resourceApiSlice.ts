import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResource, ResourceType } from '../types/resourceTypes';
import { CreateResourcePayload, UpdateResourcePayload } from '../types/resourcePayloads';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';

export const resourceApi = createApi({
  reducerPath: 'resourceApi',
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
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    // Fetch Resources
    fetchResources: builder.query<{ resources: IResource[]; total: number }, { page: number; limit: number; type?: ResourceType; search?: string; tags?: string[] }>(
      {
        query: ({ page, limit, type, search, tags }) => {
          let url = `resources?page=${page}&limit=${limit}`;
          if (type) url += `&type=${encodeURIComponent(type)}`;
          if (search) url += `&search=${encodeURIComponent(search)}`;
          if (tags && tags.length > 0) url += `&tags=${tags.map(encodeURIComponent).join(',')}`;
          return url;
        },
        providesTags: (result) =>
          result
            ? [
                ...result.resources.map(({ _id }) => ({ type: 'Resource' as const, id: _id })),
                { type: 'Resource', id: 'LIST' },
              ]
            : [{ type: 'Resource', id: 'LIST' }],
      }
    ),

    // Fetch Resource by ID
    fetchResourceById: builder.query<IResource, string>({
      query: (id) => `resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resource', id }],
    }),

    // Fetch Related Resources
    fetchRelatedResources: builder.query<IResource[], { id: string }>({
      query: ({ id }) => `resources/${id}/related`,
      providesTags: (result, error, { id }) => [{ type: 'Resource', id }],
    }),

    // Create Resource
    createResource: builder.mutation<IResource, CreateResourcePayload>({
      query: (payload) => ({
        url: 'resources',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON is sent
        },
        body: payload,
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }],
    }),

    // Update Resource
    updateResource: builder.mutation<IResource, UpdateResourcePayload>({
      query: (payload) => ({
        url: `resources/${payload.id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON is sent
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resource', id }],
    }),

    // Acknowledge Resource
    acknowledgeResource: builder.mutation<IResource, { resourceId: string }>({
      query: ({ resourceId }) => ({
        url: `resources/${resourceId}/acknowledge`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { resourceId }) => [{ type: 'Resource', id: resourceId }],
    }),

    fetchUserResources: builder.query<IResource[], void>({
      query: () => 'resources/user',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Resource' as const, id: _id })),
              { type: 'Resource', id: 'USER_LIST' },
            ]
          : [{ type: 'Resource', id: 'USER_LIST' }],
    }),

    // Send Resource to Users
    sendResourceToUsers: builder.mutation<{ message: string }, { resourceId: string; userIds: string[] }>({
      query: ({ resourceId, userIds }) => ({
        url: 'resources/send',
        method: 'POST',
        body: { resourceId, userIds },
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }],
    }),

    // Delete Resource
    deleteResource: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Resource', id }, { type: 'Resource', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchResourcesQuery,
  useFetchResourceByIdQuery,
  useFetchRelatedResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useAcknowledgeResourceMutation,
  useSendResourceToUsersMutation,
  useFetchUserResourcesQuery,
} = resourceApi;
