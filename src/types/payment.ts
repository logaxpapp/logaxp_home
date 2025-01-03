
interface IContractorBase {
    _id: string;
    name: string;
    // add any other needed fields 
  }

  export interface PaymentContract {
    _id: string;
    projectName: string;
    [key: string]: any; // Add additional fields if necessary
  }

export interface IPayment {
  _id: string;
  contract: string | Contract; // Can be populated with Contract details
  contractor: string | User; // Can be populated with User details
  amount: number;
  currency: string; // Added currency field
  exchangeRate?: number; // Added exchangeRate field
  date: string; // ISO string
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Declined'
    | 'AcceptedByContractor'
    | 'DeclinedByContractor'
    | 'AwaitingAcknowledgment'
    | 'AwaitingConfirmation';
  acknowledgment: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CreatePaymentRequest {
  contract: string;
  contractor: string;
  amount: number;
  currency: string; // Added currency field
}

// src/types/payment.ts

export interface PaymentSummaryResponse {
  projectName: string;
  description: string;
  status: string;
  currency: string;
  totalCost: number;
  totalPaid: number;
  balance: number;
}


// Define Contract and User interfaces as needed
export interface Contract {
  projectName: string;
  description: string;
  status: string;
  totalCost: number;
  // Add other relevant fields
}

export interface User {
  name: string;
  // Add other relevant fields
}
