// src/types/googleCalendar.ts
export interface IGoogleCalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    attendees?: { email: string }[];
    meetLink?: string;
  }
  