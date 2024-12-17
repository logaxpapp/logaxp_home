export interface IFAQ {
    _id: string;
    question: string;
    answer: string;
    application: string; // Enum can be enforced here
    createdAt: string;
    updatedAt: string;
  }