// src/types/survey.ts



export interface IQuestion {
    _id?: string; // Question ID (MongoDB ObjectId as string)
    question_text: string;
    question_type: 'Multiple Choice' | 'Text' | 'Rating' | 'Checkbox';
    options?: string[]; // Applicable for 'Multiple Choice' and 'Checkbox' types
  }
  
  export interface ISurvey {
    _id: string;
    title: string;
    description?: string;
    questions: IQuestion[];
    created_by: string; // Admin User ID (MongoDB ObjectId as string)
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
    surveys?: ISurveyResponse[]; // Applicable for surveys that have been completed
  }
  export interface IUser {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface ISurveyAssignment {
    _id: string;
    survey: ISurvey; // Use ISurvey type here instead of just `string`
    user: string | IUser; // Can be a user ID or an object with user details
    due_date?: string; // ISO Date string
    status: 'Pending' | 'Completed';
    completed_at?: string; // ISO Date string
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
  }
  

  
  // src/types/survey.ts
export interface IResponse {
  question_id: string; // Always use string here for simplicity
  response_text: string | string[] | number;
}

  
  
  export interface ISurveyResponse {
    _id: string;
    survey_assignment: ISurveyAssignment; 
    responses: IResponse[];
    submitted_at: string; // ISO Date string
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
  }
  
  