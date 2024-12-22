// src/types/contractTypes.ts

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface IContractor {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string; // e.g., 'contractor'
  status: string; // e.g., 'Active', 'Pending', 'Suspended', etc.
  onlineStatus: string; // e.g., 'online', 'offline'
  applications_managed: any[]; // Replace 'any' with specific types if possible
  deletionApprovedBy: string | null;
  deletionRejectedBy: string | null;
  employee_id: string;
  address: Address;
  hourlyRate: number;
  overtimeRate: number;
  onboarding_steps_completed: any[]; // Replace 'any' with specific types if possible
  googleConnected: boolean;
  passwordExpiryNotified: boolean;
  acknowledgedPolicies: any[]; // Replace 'any' with specific types if possible
  passwordHistory: any[]; // Replace 'any' with specific types if possible
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  passwordChangedAt: string; // ISO Date string
  profilePicture?: string;
  __v: number;
  lastLoginAt: string; // ISO Date string
}

export enum PaymentTerms {
  Hourly = 'Hourly',
  Fixed = 'Fixed',
  Milestone = 'Milestone',
  Retainer = 'Retainer',
  Commission = 'Commission',
}

export interface IContract {
  _id: string;
  contractor: IContractor; // Complete contractor details
  admin: string; // Admin ID
  projectName: string;
  description: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  paymentTerms: PaymentTerms; // Updated to enum
  totalCost: number;
  status:  'Draft' | 'Active' | 'Completed' | 'Terminated' | 'Pending' | 'Accepted';
  deliverables: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractResponse {
  contracts: IContract[];
  total: number;
}

// Adjusted CreateContractRequest type
export type CreateContractRequest = Omit<
  IContract,
  '_id' | 'status' | 'createdAt' | 'admin' | 'updatedAt' | 'contractor'
> & { contractor: string };

// Adjusted UpdateContractRequest type
export type UpdateContractRequest = Partial<Omit<IContract, 'contractor'>> & { contractor?: string };
