// src/types/task.ts

import { IUser } from './user';

/**
 * SubTask, TimeLog, and CustomField interfaces
 * to attach to ICard.
 */
export interface ISubTask {
  id: string,
  title: string;
  completed: boolean;
  dueDate?: string;    // ISO date string
  assignee?: string;   // userId as string
}

export interface ITimeLog {
    id:string;
  user: string;       // userId as string
  start: string;      // ISO date string
  end?: string;       // ISO date string
  duration?: number;  // e.g., total minutes or hours
}

export interface ICustomField {
  id:string;
  key: string;        // e.g., "Priority"
  value: string;      // e.g., "High"
}

/**
 * Board interface
 */
export interface IBoard {
  _id: string;
  name: string;
  description?: string;
  owner: string;        // userId
  members: string[];    // userIds
  lists: IList[];       // populated data
  labels: string[];     // label IDs
  createdAt: string;
  updatedAt: string;
  headers?: string[];   // array of column headers
}

/**
 * List interface
 */
export interface IList {
  _id: string;
  name: string;
  board: string;        // boardId
  position: number;
  cards: ICard[];       // populated data
  createdAt: string;
  updatedAt: string;
  header: string;       
}

/**
 * Card interface (EXTENDED to have subTasks, timeLogs, customFields)
 */
export interface ICard {
  _id: string;
  title: string;
  description?: string;
  list: string; // List ID
  assignees: (string | { _id: string; name: string; email: string })[];
  labels: ILabel[]; 
  boardId: string; // Board ID
  dueDate?: string;
  attachments: IAttachment[]; 
  comments: IComment[];
  position: number;
  subTasks?: ISubTask[];
  timeLogs?: ITimeLog[];
  customFields?: ICustomField[];
  status: string; // New Field
  priority: string; // New Field
  likes: string[]; // User IDs
  watchers: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
  listName?: string; // Added for table view
}

/**
 * ICommentInput interface for sending data to backend
 */
export interface ICommentInput {
  cardId: string;
  content: string;
  parentCommentId?: string;
}

/**
 * Comment interface for receiving data from backend
 */
export interface IComment extends ICommentInput {
  _id: string;
  author: IUser; // Populated User object
  likes: string[]; // User IDs who liked the comment
  mentions: string[]; // User IDs mentioned in the comment
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  replies?: IComment[]; // Nested Replies (optional, depending on backend implementation)
  comments: IComment[];
}

/**
 * Label interface
 */
export interface ILabel {
  _id: string;
  name: string;
  color: string;
  boardId: string;       // boardId
  createdAt: string;
  updatedAt: string;
}

/**
 * Attachment interface
 */
export interface IAttachment {
  _id: string;
  card: string;       // cardId
  uploader: string;   // userId
  filename: string;
  url: string;
  uploadedAt: string;
}

/**
 * Activity interface
 */
export interface IActivity {
  _id: string;
  board?: string;
  list?: string;
  card?: string;
  user: IUser;     // or possibly IUser | null
  type: string;       // ActivityType
  details: string;
  createdAt: string;
}

/**
 * For updating lists
 */
export interface IUpdateListInput {
  _id: string;
  cards?: string[]; // array of card IDs
  name?: string;
  // include other updatable fields if necessary
}

/**
 * For updating board-lists order
 */
export interface IUpdateBoardListsInput {
  _id: string;
  lists: string[]; // array of list IDs in the desired order
}

/**
 * Define ICreateCardInput
 */
export interface ICreateCardInput {
  title: string;
  description?: string;
  list: string; // List ID
  assignees?: string[]; // User IDs
  labels?: string[]; // Label IDs
  dueDate?: string; // ISO string
  position?: number;
  status?: string; // New Field
  priority?: string; // New Field
}

export interface ICardWithListName extends ICard {
  listName: string;
  
}
