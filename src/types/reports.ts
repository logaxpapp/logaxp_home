// src/types/reports.ts

/**
 * Interface representing an average performance rating per appraisal period.
 */
export interface IAveragePerformanceReport {
    periodName: string;
    averageRating: number;
    totalRequests: number;
  }
  
  /**
   * Interface representing the count of approval requests by status.
   */
  export interface IAppraisalStatusReport {
    status: string;
    count: number;
  }
  
