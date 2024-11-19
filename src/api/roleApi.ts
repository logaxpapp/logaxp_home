import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IRole } from '../types/role';
import { setSessionExpired } from '../store/slices/sessionSlice'; // Import session expired action
import type { RootState } from '../app/store'; // Import RootState
import { ROLE_API } from './endpoints';
import { Permission } from '../types/enums';


// Custom transformResponse to map permissions to Permission enum
const transformRole = (role: any): IRole => {
    return {
      ...role,
      permissions: role.permissions.map((perm: string) => perm as Permission),
    };
  };

export const roleApi = createApi({
  reducerPath: 'roleApi',
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
  tagTypes: ['Roles'],
  endpoints: (builder) => ({
    getRoles: builder.query<IRole[], void>({
        query: () => `${ROLE_API}`,
        transformResponse: (response: any[]) => response.map(transformRole),
        providesTags: ['Roles'],
        }),
          createRole: builder.mutation<IRole, Partial<IRole>>({
            query: (body) => ({
              url: 'roles',
              method: 'POST',
              body,
            }),
            invalidatesTags: ['Roles'],
          }),
          updateRole: builder.mutation<IRole, { id: string; updates: Partial<IRole> }>({
            query: ({ id, updates }) => ({
              url: `roles/${id}`,
              method: 'PUT',
              body: updates,
            }),
            invalidatesTags: ['Roles'],
          }),
          deleteRole: builder.mutation<{ message: string }, string>({
            query: (id) => ({
              url: `roles/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['Roles'],
          }),
        }),
      });
      
      export const {
        useGetRolesQuery,
        useCreateRoleMutation,
        useUpdateRoleMutation,
        useDeleteRoleMutation,
      } = roleApi;