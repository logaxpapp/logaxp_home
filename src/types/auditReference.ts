// src/types/auditReference.ts
export interface IAuditReferenceComparison {
    [fieldName: string]: {
      fromReferee: string | Date | null | undefined;
      fromReference: string | Date | null | undefined;
    };
  }
  
  export interface IAuditReferenceResponse {
    referenceId: string;
    refereeId: string;
    comparison: IAuditReferenceComparison;
  }
  