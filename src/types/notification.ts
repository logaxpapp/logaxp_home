import { IUser } from './user';

export interface Notification {
  _id: string;
  type: string;
  recipient: string;
  sender: string | IUser | null; 
  data?: any;
  read: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  message?: string;
}
