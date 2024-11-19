// src/api/permissionApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPermission } from '../types/permission'; // Import IPermission type
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action
import type { RootState } from '../app/store'; // Import RootState

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
      credentials: 'include', // Include credentials
      prepareHeaders: (headers, { getState }) => {
        const csrfToken = (getState() as RootState).csrf.csrfToken;
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken); // Add CSRF token if available
        }
        return headers;
      },
    });

    const result = await base(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['Permissions'],
  endpoints: (builder) => ({
    getPermissions: builder.query<IPermission[], void>({
        query: () => 'permissions',
        providesTags: ['Permissions'],
      }),
      createPermission: builder.mutation<IPermission, Partial<IPermission>>({
        query: (body) => ({
          url: 'permissions',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Permissions'],
      }),
      updatePermission: builder.mutation<IPermission, { id: string; updates: Partial<IPermission> }>({
        query: ({ id, updates }) => ({
          url: `permissions/${id}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: ['Permissions'],
      }),
      deletePermission: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `permissions/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Permissions'],
      }),
    }),
  });
  
  export const {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
  } = permissionApi;