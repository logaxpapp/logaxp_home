// src/api/auditApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAuditLog } from '../types/audit';

export const auditApi = createApi({
  reducerPath: 'auditApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/audit-logs`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    fetchAuditLogs: builder.query<{ total: number; logs: IAuditLog[]; page: number; pages: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `?page=${page}&limit=${limit}`,
    }),
    createAuditLog: builder.mutation<IAuditLog, { user: string; changed_by: string; changes: Record<string, { old: any; new: any }> }>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useFetchAuditLogsQuery, useCreateAuditLogMutation } = auditApi;
