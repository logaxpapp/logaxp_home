export interface IFAQ {
    _id: string;
    question: string;
    answer: string;
    application: string; 
    createdBy: string;   // string for simplicity
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
  }