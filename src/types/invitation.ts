// src/types/invitation.ts

export interface IInvitation {
    /** Unique identifier for the invitation (e.g. MongoDB _id) */
    _id: string;
  
    /** The ID of the board to which this invitation pertains */
    boardId: string;
  
    /** The email address of the person being invited */
    invitedEmail: string;
  
    /** A token (random string) used to accept or verify the invite */
    inviteToken: string;
  
    /** Role or permission level (e.g. 'subContractor', 'user', 'admin') */
    role: string;
  
    /** ISO date string of creation time */
    createdAt: string;
  
    /** ISO date string of last update time */
    updatedAt: string;
  }
  