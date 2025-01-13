// src/types/reference.ts

/**
 * The status values in the Reference model.
 */
export enum ReferenceStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Received = 'Received',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export interface IReference {
  _id: string;

  applicant: 
    | string 
    | { 
        _id: string; 
        name: string; 
        email: string; 
      };

  referee: 
    | string 
    | {
        _id: string;
        name: string;
        email: string;
        
        // ✅ Add these if your backend returns them in `referee`:
        positionHeld?: string;
        companyName?: string;
      };

  // If your 'createdBy' is sometimes just a string ID or an object:
  createdBy:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };

  // And so on for other fields...
  relationship: string;
  positionHeld: string;   // (top-level if you have it here)
  companyName?: string;   // (if you store it top-level as well)
  
  // etc.
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  salary: string;
  performance: string;
  conduct: string;
  integrity: string;
  additionalComments?: string;
  refereeSignature: string;

  status: ReferenceStatus;
  updatedBy?: string;     // or { _id, name, email } if needed
  attachments?: string[];

  sentAt?: string;
  receivedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
  token: string;
  tokenExpiresAt: string;
  createdAt: string;
  updatedAt: string;

  daysAbsent?: string;
  periodsAbsent?: string;

  referenceId?: string;
  name?: string;
  address?: string;
  reEmploy?: string;
}
