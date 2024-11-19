// src/types/user.ts


// src/types/user.ts

export enum Application {
  LogaBeauty = 'LogaBeauty',
  GatherPlux = 'GatherPlux',
  TimeSync = 'TimeSync',
  BookMiz = 'BookMiz',
  DocSend = 'DocSend',
  ProFixer = 'ProFixer',
}

export enum Department {
  HR = 'HR',
  IT = 'IT',
  Sales = 'Sales',
  Marketing = 'Marketing',
  Finance = 'Finance',
}

export enum OnboardingStepStatus {
  InProgress = 'InProgress',
  Pending = 'Pending',
  Complete = 'Complete',
}

export enum EmploymentType {
  FullTime = 'Full-Time',
  PartTime = 'Part-Time',
  Internship = 'Internship',
  Volunteer = 'Volunteer',
}

export enum JobTitle {
  Developer = 'Developer',
  Admin = 'Admin',
  Secretary = 'Secretary',
  // Add more job titles as needed
}


export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export enum UserRole {
  Admin = 'admin',
  Support = 'support',
  User = 'user',
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Suspended = 'Suspended',
  PendingDeletion = 'Pending Deletion',
  Inactive = 'Inactive',
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  applications_managed: Application[];
  job_title: string;
  status: string;
  employee_id: string;
  department: string;
  phone_number: string;
  address: IAddress;
  date_of_birth: string; // ISO string
  employment_type: string;
  onboarding_steps_completed: any[]; // Replace `any` with appropriate type
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  password?: string; // Optional password field for password-based authentication
  manager?: string | IUser; // Manager ID or IUser object
  profile_picture_url?: string;
  createdBy?: string; // User ID who created the user
  updatedBy?: string; // User ID who last updated the user
  token?: string; 
  googleConnected?: boolean;
  lastAccessed?: string; // ISO string
  passwordExpiryNotice?: string; // ISO string
  acknowledgedPolicies?: string[]; // Policy IDs
 
  __v: number;
}
