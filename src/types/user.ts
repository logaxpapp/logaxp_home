// src/types/user.ts

import { OnlineStatus } from './enums'; // Ensure you have the correct path

export enum Application {
  LogaBeauty = 'LogaBeauty',
  GatherPlux = 'GatherPlux',
  TimeSync = 'TimeSync',
  BookMiz = 'BookMiz',
  DocSend = 'DocSend',
  ProFixer = 'ProFixer',
  // Add more applications as needed
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
  Manager = 'Manager',
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
  Approver = 'approver',
  Contractor = 'contractor',
  SubContractor = 'subContractor',
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Suspended = 'Suspended',
  PendingDeletion = 'Pending Deletion',
  Inactive = 'Inactive',
}

export enum OnboardingStep {
  WelcomeEmail = 'WelcomeEmail',
  ProfileSetup = 'ProfileSetup',
  SystemTraining = 'SystemTraining',
  ComplianceTraining = 'ComplianceTraining',
  FirstTask = 'FirstTask',
  // Add other onboarding steps as needed
}

export interface IUserMinimal {
  _id: string;
  name: string;
  email: string;
  profile_picture_url: string;
  role: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  applications_managed: Application[];
  job_title: JobTitle;
  status: UserStatus;
  employee_id: string;
  department: Department;
  phone_number: string;
  address: IAddress;
  date_of_birth: string; // ISO string
  employment_type: EmploymentType; 
  onboarding_steps_completed?: OnboardingStep[]; 
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  password?: string; // Optional password field for password-based authentication
  manager?: string | Pick<IUser, '_id' | 'name'>; 
  profile_picture_url?: string;
  createdBy?: string; // User ID who created the user
  updatedBy?: string; // User ID who last updated the user
  token?: string;
  hourlyRate?: number;
  overtimeRate?: number; 
  googleConnected?: boolean;
  lastAccessed?: string; // ISO string
  passwordExpiryNotice?: string; // ISO string
  acknowledgedPolicies?: string[]; // Policy IDs
  isLoggedIn?: boolean;
  onlineStatus?: OnlineStatus; // **Added Property**
  __v: number;
}

// Type guard function
function isIUser(sender: string | IUser | undefined): sender is IUser {
  return typeof sender === 'object' && sender !== null && 'name' in sender;
}
