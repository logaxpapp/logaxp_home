// src/types/groupMessage.ts

import { IUserMinimal } from './user';

export interface IGroupMessage {
  _id: string;
  content: string;
  sender: IUserMinimal;
  groupId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string; // Optional file URL
  reactions?: []
  edited?: boolean; // Indicates if the message has been edited
  read?: boolean; // Indicates if the message has been read by the recipient
}
