// src/types/referee.ts

/******************************************************
 * RefereeStatus?
 * We removed any "status" field from the Referee model
 * because we track status in the Reference model.
 ******************************************************/

/**
 * The Referee interface reflects the updated backend schema.
 * These fields store what the user (applicant) claims about the referee,
 * plus the user’s signature affirming correctness.
 */
export interface IReferee {
  _id: string;
  user: string; // The ID of the user (applicant) who created this referee

  name: string;
  email: string;
  companyName: string;
  relationship: string;

  // Replaced "dateStarted" / "dateEnded" with "startDate" / "endDate"
  startDate: string; // e.g., 2025-01-01 (ISO date string)
  endDate: string;   // e.g., 2025-12-31 (ISO date string)

  reasonForLeaving: string;
  address: string;

  positionHeld: string;      // The referee's own position
  userPositionHeld: string;  // The user’s (applicant’s) position

  userSignature: string;     // The user’s signature (base64 or URL)

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * The parameters for fetching referees, e.g., with search or pagination.
 * No 'status' field is required because we removed it from the Referee model.
 */
export interface GetRefereesParams {
  search?: string;
  page?: number;
  limit?: number;
}
