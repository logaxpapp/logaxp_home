// 1) The shape of the server’s response:
export interface IPublicReferenceResponse {
    message: string;
    reference: {
      _id: string;
      status: string;
      token: string;
      tokenExpiresAt: string;
  
      // ✅ Add optional fields:
      startDate?: string;
      endDate?: string;
      salary?: string;
      positionHeld?: string;
      relationship?: string;
      reasonForLeaving?: string;
      daysAbsent?: string;
      periodsAbsent?: string;
      conduct?: string;
      performance?: string;
      integrity?: string;
      additionalComments?: string;
  
      applicant?: {
        _id: string;
        name: string;
        email: string;
      };
      referee?: {
        _id: string;
        name: string;
        email: string;
        userPositionHeld?: string;
        startDate?: string;
        // ...
      };
    };
  }
  
  
  // 2) The shape of the local form fields (if you need a simpler interface for quick usage):
  export interface IEmploymentReferenceFormData {
    startDate: string;       // replaced "from"
    endDate: string;         // replaced "to"
    positionHeld: string;    // replaced "position"
    reasonForLeaving: string;
    salary: string;
    // etc. (daysAbsent, performance, etc. if needed)
  }
  
  // 3) Another shape that represents the entire reference object from the server:
  export interface IPublicReferenceFormData {
    _id: string;
  
    applicant: {
      _id: string;
      name: string;
      email?: string;
    };
  
    referee: {
      _id: string;
      name: string;
      userPositionHeld: string;
      startDate: string; // or Date => front-end usually uses string
      // plus any other needed fields from Referee
    };
  
    status: string; // "Pending", "Sent", etc.
    token: string;
    tokenExpiresAt: string;
    // ...
  }
  