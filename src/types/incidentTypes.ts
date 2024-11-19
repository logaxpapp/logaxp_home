// src/types/incidentTypes.ts

export enum IncidentType {
    NaturalDisaster = 'Natural Disaster',
    Traffic = 'Traffic',
    PoliticalUnrest = 'Political Unrest',
    Other = 'Other',
  }
  
  export enum IncidentSeverity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
  }
  
  export interface IIncident {
    _id: string;
    title: string;
    description: string;
    type: IncidentType;
    severity: IncidentSeverity;
    location: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  