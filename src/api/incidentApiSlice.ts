// src/api/incidentApiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IIncident, IncidentType, IncidentSeverity } from '../types/incidentTypes';
import { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice';

export const incidentApi = createApi({
  reducerPath: 'incidentApi',
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
  tagTypes: ['Incident'],
  endpoints: (builder) => ({
    // Fetch Incidents
    fetchIncidents: builder.query<{ incidents: IIncident[]; total: number }, { page: number; limit: number; type?: IncidentType; severity?: IncidentSeverity; search?: string }>({
      query: ({ page, limit, type, severity, search }) => {
        let url = `incidents?page=${page}&limit=${limit}`;
        if (type) url += `&type=${type}`;
        if (severity) url += `&severity=${severity}`;
        if (search) url += `&search=${search}`;
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.incidents.map(({ _id }) => ({ type: 'Incident' as const, id: _id })),
              { type: 'Incident', id: 'LIST' },
            ]
          : [{ type: 'Incident', id: 'LIST' }],
    }),

    // Fetch Incident by ID
    fetchIncidentById: builder.query<IIncident, string>({
      query: (id) => `incidents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),

    // Create Incident
    createIncident: builder.mutation<IIncident, Partial<IIncident>>({
      query: (incident) => ({
        url: 'incidents',
        method: 'POST',
        body: incident,
      }),
      invalidatesTags: [{ type: 'Incident', id: 'LIST' }],
    }),

    // Update Incident
    updateIncident: builder.mutation<IIncident, { id: string; updates: Partial<IIncident> }>({
      query: ({ id, updates }) => ({
        url: `incidents/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Incident', id }],
    }),

    // Delete Incident
    deleteIncident: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `incidents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Incident', id }, { type: 'Incident', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchIncidentsQuery,
  useFetchIncidentByIdQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} = incidentApi;
