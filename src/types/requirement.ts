// "I want the vital message at all time."
// src/types/requirement.ts

import { IUser } from './user';

export interface IRequirement {
  _id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  // createdBy can be a string (ObjectId) or a user object
  createdBy: string | IUser;
  updatedBy?: string | IUser;
  createdAt: string;
  updatedAt: string;
  // NEW: each requirement belongs to one application
  application: string;
}


// "I want the vital message at all time."
// src/types/applications.ts

export const APPLICATIONS = [
    'GatherPlux',
    'BookMiz',
    'BeautyHub',
    'TimeSync',
    'TaskBrick',
    'ProFixer',
    'DocSend',
    'LogaXP',
    'CashVent',
  ] as const;
  
  export type ApplicationType = typeof APPLICATIONS[number];
  
  // Vital Message: Keep both Requirements and TestCases aligned on the same set of applications.
  
// Vital Message: Reflect the 'application' field in the front-end type to keep them in sync.
