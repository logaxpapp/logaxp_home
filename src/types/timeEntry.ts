// src/types/timeEntry.ts

import { IUser } from './user';
import { IShift } from './shift';

export interface ITimeEntry {
  _id: string; // MongoDB ID for the TimeEntry
  employee: IUser | string; // Reference to Employee (populated or ID)
  shift: IShift | string; // Reference to Shift (populated or ID)
  clockIn: string; // Clock-in timestamp (ISO string)
  clockOut: string | null; // Clock-out timestamp (ISO string or null)
  hoursWorked: number; // Calculated hours worked
  status: 'clockedIn' | 'clockedOut' | 'onBreak' | 'absent'; // Add status field
  createdAt: string; // Creation timestamp (ISO string)
  updatedAt: string; // Last update timestamp (ISO string)
  breaks?: { breakStart: Date; breakEnd?: Date }[]; // Optional breaks
  reasonForAbsence?: string; // Optional reason for absence
  
}

// Input Type for Creating a Time Entry
export interface ITimeEntryInput {
  employeeId: string; // Employee ID (changed from employee to employeeId for clarity)
  shiftId?: string; // Shift ID
  clockIn: string; // Clock-in time (ISO string)
  clockOut?: string; // Clock-out time (optional, ISO string)
  status?: 'clockedIn' | 'clockedOut' | 'onBreak' | 'absent'; // Optional status
  
}

// Input Type for Updating a Time Entry
export interface ITimeEntryUpdate {
  employee?: string; // Allow updating employee
  shift?: string;    // Allow updating shift
  clockIn?: string;  // Updated clock-in time (ISO string)
  clockOut?: string; // Updated clock-out time (ISO string)
  status?: 'clockedIn' | 'clockedOut' | 'onBreak' | 'absent'; // Updated status
  description?: string; // Updated description (optional)
}


export interface UpdateTimeEntryFormProps {
  timeEntry: ITimeEntry;
  onClose: () => void;
  onSave: (updates: ITimeEntryUpdate) => Promise<void>; // Updated to match the mutation
}

