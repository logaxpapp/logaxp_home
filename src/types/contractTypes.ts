// src/types/contractTypes.ts

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface IRisk {
  
  riskName: string;
  description?: string;
  severity?: 'Low' | 'Medium' | 'High';
  probability?: number;
  impact?: 'Low' | 'Medium' | 'High';
  mitigationStrategy?: string;
}


export interface IContractor {
  _id: string;
  name: string;
  email: string;
  companyName: string; 
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

  riskSection: IRisk[];
}

// Extended interface for frontend use
export interface IFrontendRisk extends IRisk {
  _id: string; // Unique identifier for React keys
}

export enum PaymentTerms {
  Hourly = 'Hourly',
  Fixed = 'Fixed',
  Milestone = 'Milestone',
  Retainer = 'Retainer',
  Commission = 'Commission',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  NGN = 'NGN',
  // Add other currencies as needed
}
export const CurrencyOptions: { value: Currency; label: string }[] = [
  { value: Currency.USD, label: 'USD - United States Dollar' },
  { value: Currency.EUR, label: 'EUR - Euro' },
  { value: Currency.GBP, label: 'GBP - British Pound' },
  { value: Currency.NGN, label: 'NGN - Nigerian Naira' },
  // Add other currencies as needed
];

// Define options for select inputs
export const PaymentTermsOptions = [
  { value: PaymentTerms.Hourly, label: 'Hourly' },
  { value: PaymentTerms.Fixed, label: 'Fixed' },
  { value: PaymentTerms.Milestone, label: 'Milestone' },
  { value: PaymentTerms.Retainer, label: 'Retainer' },
  { value: PaymentTerms.Commission, label: 'Commission' },
];

export interface IContract {
  _id: string;
  contractor: IContractor;
  companyName : string;
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
  currency: Currency; 
  risks?: IRisk[];
  riskSection?: IRisk[]; // Add riskSection explicitly
}

export interface ContractResponse {
  contracts: IContract[];
  total: number;
}


export type CreateContractRequest = Omit<
  IContract,
  '_id' | 'createdAt' | 'admin' | 'updatedAt' | 'contractor'
> & {
  contractor: string;
  status?: 'Draft' | 'Pending' | 'Active' | 'Completed' | 'Terminated' | 'Accepted';
  currency: Currency; // Added currency field
  risks?: IRisk[];
  companyName: string;
};

// Adjusted UpdateContractRequest type
export type UpdateContractRequest = Partial<
  Omit<IContract, 'contractor'>
> & {
  contractor?: string;
  riskSection?: IRisk[]; // Add riskSection explicitly
};
