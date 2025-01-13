// src/api/reportApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import { IReportData, ReportType } from '../types/report';

/**
 * Input Types
 */
export interface IGenerateReportInput {
  reportType: ReportType;
  boardId?: string;
  listId?: string;
  userId?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

export interface IFetchAllReportsInput {
  page?: number;
  limit?: number;
  boardId?: string;
  // If you want to allow query by certain filters from front-end
  // e.g. userId, boardId, etc. you can add them here.
}

export interface IFetchReportByIdInput {
  reportId: string;
}

interface IFetchAllReportsResponse {
  reports: any[];
  total: number;
  page: number;
  pages: number;
}

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: customBaseQuery, // your custom fetch logic
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    /**
     * Generate and Save Report
     */
    generateReport: builder.mutation<IReportData, IGenerateReportInput>({
      query: (body) => ({
        url: '/task-reports/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Report'],
    }),

    /**
     * Fetch All Reports
     */
    fetchAllReports: builder.query<IFetchAllReportsResponse, IFetchAllReportsInput>({
      query: (params) => ({
        url: '/task-reports',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.reports.map((r) => ({ type: 'Report' as const, id: r._id })),
              { type: 'Report', id: 'LIST' },
            ]
          : [{ type: 'Report', id: 'LIST' }],
    }),

    /**
     * Fetch Report by ID
     */
    fetchReportById: builder.query<any, IFetchReportByIdInput>({
      query: ({ reportId }) => `/task-reports/${reportId}`,
      providesTags: (result, error, { reportId }) => [{ type: 'Report', id: reportId }],
    }),

    /**
     * Delete Report by ID
     */
    deleteReport: builder.mutation<{ message: string }, string>({
      query: (reportId) => ({
        url: `/task-reports/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, reportId) => [{ type: 'Report', id: reportId }],
    }),
  }),
});

export const {
  useGenerateReportMutation,
  useFetchAllReportsQuery,
  useFetchReportByIdQuery,
  useDeleteReportMutation,
} = reportApi;
