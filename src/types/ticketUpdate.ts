// src/types/ticketUpdate.ts

import { ITicketCreate } from './ticketCreate';

export interface ITicketUpdate {
    ticketId: string;
    updates: Partial<ITicketCreate>;
  }
  