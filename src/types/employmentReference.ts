// src/types/employmentReference.ts

export interface IEmploymentReferenceFormData {
    from: string;
    to: string;
    position: string;
    reasonForLeaving: string;
    salary: string;
    daysAbsent: string;
    periodsAbsent: string;
    attendance: string;
    conduct: string;
    performance: string;
    relationships: string;
    integrity: string;
    unsuitableReasons: string;
    reEmploy: string;
    disciplinaryConcerns: string;
    details: string;
    name: string;
    jobTitle: string;
    date: string;
    companyName: string;
    companyAddress: string;
  }
  
  export interface IEmploymentReferenceErrors {
    [key: string]: string | undefined;
  }
  