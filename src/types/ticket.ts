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
    | 'General Inquiry'
    | 'Escalated'
    | 'Closed'; // Updated categories
  application: 'Loga Beauty' | 'GatherPlux' | 'TimeSync' | 'BookMiz';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Open' | 'Critical';
  assignedTo?: IUser;
  department: 'HR' | 'IT' | 'Sales' | 'Marketing' | 'Finance';
  date: string;
  dueDate?: string;
  tags: Tag[];
  comments: IComment[];
  attachments: IAttachment[];
  activityLog: IActivityLog[];
  createdBy: string;
  updatedBy?: string;

  // New fields
  watchers: IUser[]; // or string[] depending on what the backend returns
  customFields: Record<string, any>;
}
