// src/types/AppraisalPeriod.ts

export interface IAppraisalPeriod {
  _id: string;
  name: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  submissionDeadline: string; // ISO Date string
  reviewDeadline: string; // ISO Date string
  isActive: boolean;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}
