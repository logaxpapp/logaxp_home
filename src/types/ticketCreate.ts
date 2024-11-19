// src/types/ticketCreate.ts


import { Tag } from './tag';


export interface ITicketCreate {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    category: 'Technical Issue' | 'Access Request' | 'Bug Report' | 'Feature Request' | 'General Inquiry';
    application: 'Loga Beauty' | 'GatherPlux' | 'TimeSync' | 'BookMiz';
    status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Open' | 'Critical';
    assignedTo?: string | null; // User ID
    department: 'HR' | 'IT' | 'Sales' | 'Marketing' | 'Finance';
    date: string; // ISO string, set by frontend or backend
    dueDate?: string; // ISO string
    tags: Tag[];
    // Attachments can be handled separately
  }
  