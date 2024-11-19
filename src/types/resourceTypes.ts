// src/types/resourceTypes.ts

export enum ResourceType {
    Policy = 'Policy',
    Tutorial = 'Tutorial',
    Documentation = 'Documentation',
    Other = 'Other',
  }
  export enum Tags {
    Security = 'Security',
    Compliance = 'Compliance',
    Development = 'Development',
    Education = 'Education',
    Marketing = 'Marketing',
  }
  
  export interface IResource {
    _id: string;
    title: string;
    type: ResourceType;
    content: string;
    images: string[]; 
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    tags: string[];
    createdAt: string;
    updatedAt: string;
    acknowledgedAt?: Date;
  }
  