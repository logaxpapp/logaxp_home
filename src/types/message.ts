// src/types/message.ts

export interface Reaction {
  user: string; // User ID who reacted
  emoji: string;
}

export interface IMessage {
  _id: string; // Now `_id` is required
  content: string;
  sender: string; // User ID of the sender
  receiver: string; // User ID of the receiver
  groupId?: string; // Optional for group messages
  timestamp: string;
  read: boolean;
  readBy: string[]; // Array of user IDs who have read the message
  reactions: Reaction[]; // Array of reactions
  edited: boolean; // Indicates if the message has been edited
  fileUrl?: string;
}
