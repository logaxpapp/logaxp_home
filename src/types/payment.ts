
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
/**
 * Define your IPayment interface or import from a shared types file
 */
export interface IPayment {
    _id: string;
    contract: PaymentContract | string;
    contractor: IContractorBase | string;       // Contractor ID (User)
    amount: number;
    date: string;                  // e.g., '2024-12-25T00:00:00.000Z'
    status: 'Pending' | 'Confirmed' | 'Declined';
    acknowledgment: boolean;       // Whether contractor acknowledges
    notes?: string;                // Reason for decline, etc.
    createdAt?: string;
    updatedAt?: string;
  }

  
  
  
  /**
   * For creating a payment
   */
  export interface CreatePaymentRequest {
    contract: string;     // Contract ID
    contractor: string;   // Contractor (User) ID
    amount: number;
    date?: string;        // If omitted, defaults to new Date() on the server
  }
  
  /**
   * For Payment Summary
   */
  export interface PaymentSummaryResponse {
    totalCost: number;
    totalPaid: number;
    balance: number;
  }
  
  /**
   * We'll read the BASE_URL from Vite env (adjust if needed)
   */