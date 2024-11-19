// src/types/ticket.ts

import { Tag } from './tag';
import { IUser } from './user';

export interface IComment {
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  date: string;
}


export interface IAttachment {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface IActivityLog {
  _id: string;
  action: string;
  performedBy: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
}


export interface ITicket {
  _id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category:
    | 'Technical Issue'
    | 'Access Request'
    | 'Bug Report'
    | 'Feature Request'
    | 'General Inquiry';
  application: 'Loga Beauty' | 'GatherPlux' | 'TimeSync' | 'BookMiz';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Open' | 'Critical';
  assignedTo?: IUser; // Updated to use IUser interface
  department: 'HR' | 'IT' | 'Sales' | 'Marketing' | 'Finance';
  date: string;
  dueDate?: string;
  tags: Tag[]; // Updated to use Tag enum
  comments: IComment[];
  attachments: IAttachment[];
  activityLog: IActivityLog[];
  createdBy: string; // User ID or IUser interface
  updatedBy?: string;
}
