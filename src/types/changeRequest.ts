// src/types/changeRequest.ts

import { IUser } from './user';


export interface IChangeRequestApproval {
  _id: string;
  user: IUser; // The user who submitted the change request
  request_type: 'ChangeRequest';
  request_details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  current_step: number;
  request_data: {
    fields_to_change: Partial<IUser>;
    current_values: Partial<IUser>;
  };
  steps: Array<{
    step_name: string;
    approver: IUser;
    status: 'Pending' | 'Approved' | 'Rejected';
    decision_date?: string; // ISO string
    comments?: string;
  }>;
  history: Array<{
    step_name: string;
    status: 'Approved' | 'Rejected';
    decision_date: string; // ISO string
    approver: IUser;
    comments?: string;
  }>;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}


export interface ICreateChangeRequestPayload {
    fields_to_change: Partial<IUser>;
  }

  export interface IProcessChangeRequestPayload {
    comments?: string;
  }
  // src/types/changeRequest.ts


export type ChangeRequestAllowedFields =
  | 'name'
  | 'email'
  | 'phone_number'
  | 'address'
  | 'profile_picture_url'
  | 'date_of_birth'
  | 'employment_type'
  | 'hourlyRate'
  | 'overtimeRate'
  | 'job_title'
  | 'department';



  export interface FieldConfig {
    field: ChangeRequestAllowedFields;
    label: string;
    type: 'text' | 'email' | 'number' | 'date' | 'url' | 'select' | 'address';
    options?: string[]; // For select inputs
  }