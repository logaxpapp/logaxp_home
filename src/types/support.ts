// Type for a Support Ticket
export interface ISupportTicket {
    _id: string; // Ticket ID
    ticketNumber: string; // Unique Ticket Number
    subject: string; // Ticket Subject
    description: string; // Ticket Description
    status: 'Open' | 'Resolved' | 'Pending' | 'Closed'; // Ticket Status
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'; // Priority Level
    tags?: string[]; // Optional Tags
    userId: string | { _id: string; name: string; email: string };
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
  }
  
  
  
  // Input type for creating a new ticket
  export interface ISupportTicketInput {
    subject: string;
    description: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
    tags?: string[];
  }
  
  // Type for an FAQ
  export interface IFAQ {
    _id: string; // FAQ ID matches API response
    question: string; // FAQ Question
    answer: string; // FAQ Answer
  }

  // Input type for creating/updating an FAQ
export interface IFAQInput {
    question: string;
    answer: string;
  }
  