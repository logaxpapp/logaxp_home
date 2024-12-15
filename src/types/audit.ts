import { IUser } from './user'; 

export interface IAuditLog {
  _id: string; // MongoDB ID of the audit log (as a string)
  user: string | Partial<IUser>; // The user whose profile was changed
  changed_by: string | Partial<IUser>; // The admin or system who made the change
  changes: Record<string, { old: any; new: any }>; // Fields that were changed
  timestamp: Date; // Date and time of the change
}
