// src/types/report.ts

import { IUser } from './user';


export enum ReportType {
 TASKS_BY_STATUS = 'TASKS_BY_STATUS',
 TASKS_BY_USER = 'TASKS_BY_USER',
 TASKS_BY_BOARD = 'TASKS_BY_BOARD',
 TASKS_OVERDUE = 'TASKS_OVERDUE',
 TASKS_BY_PRIORITY = 'TASKS_BY_PRIORITY',
}

/**
 * Interface for Report Filters
 */
export interface IReportFilters {
  reportType: ReportType;
  boardId?: string;
  listId?: string;
  userId?: string;
  status?: string;
  priority?: string;
  // Add more filters as needed
}

export interface IGenerateReportInput {
    reportType: ReportType;
    boardId?: string;
    listId?: string;
    userId?: string;
    status?: string;
    priority?: string;
  }

/**
 * Base Interface for Report Data
 */
interface IReportDataBase {
  title: string;
  generatedAt: string; // ISO string
}

/**
 * Interface for Tasks by Status Report
 */
export interface ITasksByStatusReportData extends IReportDataBase {
  data: Array<{
    status: string;
    count: number;
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      assignees: string[]; // Array of User IDs or names
      dueDate: string; // ISO string
    }>;
  }>;
}

/**
 * Interface for Tasks by User Report
 */
export interface ITasksByUserReportData extends IReportDataBase {
  data: Array<{
    user: string;
    email: string;
    count: number;
    tasks: Array<{
      id: string;
      title: string;
      assignee: string;
      status: string;
      priority: string;
    }>;
  }>;
}

/**
 * Interface for Tasks by Board Report
 */
export interface ITasksByBoardReportData extends IReportDataBase {
  data: Array<{
    boardName: string;
    totalTasks: number;
    tasks: Array<{
      list: string;
      tasks: Array<{
        id: string;
        title: string;
        // Add other relevant fields
      }>;
    }>;
  }>;
}

/**
 * Interface for Overdue Tasks Report
 */
export interface IOverdueTasksReportData extends IReportDataBase {
  data: Array<{
    id: string;
    title: string;
    assignees: Array<{
      name: string;
      email: string;
    }>;
    list: string;
    dueDate: string; // ISO string
    status: string;
  }>;
}

/**
 * Interface for Tasks by Priority Report
 */
export interface ITasksByPriorityReportData extends IReportDataBase {
  data: Array<{
    priority: string;
    count: number;
    tasks: Array<{
      id: string;
      title: string;
      priority: string;
      status: string;
    }>;
  }>;
}

/**
 * Union Type for All Report Data Interfaces
 */
export type IReportData =
  | ITasksByStatusReportData
  | ITasksByUserReportData
  | ITasksByBoardReportData
  | IOverdueTasksReportData
  | ITasksByPriorityReportData;

/**
 * Interface for Exported Report
 */
export interface IExportedReport {
  reportId: string;
  title: string;
  generatedAt: string; // ISO string
  data: IReportData['data']; // Reuse data from IReportData
  exportedBy: IUser;
}
