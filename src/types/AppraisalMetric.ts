// src/types/AppraisalMetric.ts

export interface IAppraisalMetric {
    _id: string;
    metric_name: string;
    description: string;
    scale?: number; // e.g., 1-5 for rating
    associated_questions: string[]; // Array of AppraisalQuestion IDs
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
  }
  
 

export enum AppraisalMetric {
    LIST = 'LIST_METRIC',
    CREATE = 'CREATE_METRIC',
    VIEW = 'VIEW_METRIC',
    EDIT = 'EDIT_METRIC',
  } 