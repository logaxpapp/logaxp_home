// src/types/shift.ts

import { IUser } from './user';

export enum ShiftStatus {
  Open = 'Open',
  Assigned = 'Assigned',
  Excess = 'Excess',
  PendingApproval = 'Pending Approval',
}

export enum ShiftTypeName {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Night = 'Night',
  PRN = 'PRN',
  VOL = 'VOL',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
  TEMPSHIFT = 'TEMPSHIFT',
  
}

export interface IShiftType {
  _id: string;
  name: ShiftTypeName;
  description?: string;
  createdAt: string;
  updatedAt: string;

  // Add this virtual property
  actions?: string; // This can be any type, e.g., string or undefined
  
}

// Unpopulated Shift Interface (shiftType as string ID)
export interface IShift {
  _id: string;
  shiftType: IShiftType; // Changed from string to IShiftType
  date: string; // ISO Date string
  startTime: string; // Format: 'HH:MM'
  endTime: string;   // Format: 'HH:MM'
  assignedTo?: IUser;
  status: ShiftStatus;
  isExcess?: boolean;
  payPeriod?: string; 
  createdBy: IUser; // Changed from string to IUser
  applicationManaged: string[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string

  // Add this virtual property
  actions?: string;
}

// Populated Shift Interface (shiftType as IShiftType)
export interface IShiftPopulated extends Omit<IShift, 'shiftType' | 'assignedTo' | 'createdBy'> {
  shiftType: IShiftType;
  assignedTo?: IUser;
  createdBy: IUser;

}
