// src/types/approval.ts

export type ApprovalRequestType = 'Leave' | 'Expense' | 'Appraisal' | 'Other';

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IApprover {
  _id: string;
  name: string;
  email: string;
}

export interface IApprovalStep {
  step_name: string;
  approver: IApprover;
  status: 'Pending' | 'Approved' | 'Rejected';
  decision_date?: Date;
  comments?: string;
}

export interface IApprovalHistory {
  step_name: string;
  status: 'Approved' | 'Rejected';
  decision_date: Date;
  approver: IApprover;
  comments?: string;
}

export interface IAppraisalPeriod {
  _id: string;
  name: string;
  // Add other relevant fields if necessary
}

// Specific Request Data Interfaces
export interface ILeaveRequestData {
  leave_type: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  reason: string;
}

export interface IExpenseRequestData {
  amount: number;
  currency: string;
  expense_category: string;
  receipt: string; // URL to receipt image or document
}

export interface IAppraisalResponse {
  questionId: string;
  answer: string;
  _id?: string; // Made optional
}

export interface IAppraisalRequestData {
  period: string; // AppraisalPeriod ID
  comments: string;
  additional_metrics?: {
    metricId: string; // ID as a string
    value: number;
  }[];
  responses: IAppraisalResponse[];
}

export interface IOtherRequestData {
  details: string;
  // Add other properties as needed
}

// Union Type for request_data
export type IRequestData = ILeaveRequestData | IExpenseRequestData | IAppraisalRequestData | IOtherRequestData;

// Main Approval Request Interface
export interface IApprovalRequest {
  _id: string;
  user: IUser;
  request_type: ApprovalRequestType;
  request_details: string;
  request_data: IRequestData;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  current_step: number;
  steps: IApprovalStep[];
  history: IApprovalHistory[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  __v: number;
}

// Types for Processing Approval Actions

export type ApprovalAction = 'finalize' | 'add_step';

export interface IProcessApprovalPayload {
  requestId: string;
  action: ApprovalAction;
  status: 'Approved' | 'Rejected';
  comments?: string;
  newApproverId?: string; // Required if action is 'add_step'
  stepName?: string;       // Required if action is 'add_step'
}

// Separate Interface for Submission Payload
export interface IApprovalRequestSubmit {
  request_type: ApprovalRequestType;
  request_details: string;
  request_data: IRequestData;
  workflow: {
    step_name: string;
    approver: string;
    status: 'Pending';
  }[];
}

export interface IGetUserApprovalRequestsResponse {
  data: IApprovalRequest[];
  total: number;
  page: number;
  pages: number;
}
