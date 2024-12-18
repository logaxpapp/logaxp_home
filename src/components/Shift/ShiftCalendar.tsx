// src/pages/ShiftCalendar.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event as CalendarEventType } from 'react-big-calendar';
import {
  useFetchGoogleCalendarEventsQuery,
  useCreateGoogleCalendarEventMutation,
  
} from '../../api/usersApi';
import { useViewScheduleQuery } from '../../api/shiftApi';
import { FaSyncAlt, FaVideo, FaSpinner, FaGoogle } from 'react-icons/fa';
import { IShift, IShiftPopulated } from '../../types/shift';
import { format, parseISO, startOfWeek, getDay, set } from 'date-fns';
import { enUS } from 'date-fns/locale';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './ShiftCalendar.css';

// Define locales for react-big-calendar
const locales = { 'en-US': enUS };

// Initialize date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Interface for calendar events with required start and end
interface CalendarEvent extends Omit<CalendarEventType, 'start' | 'end'> {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string; // Added description
  location?: string;    // Added location
  conferenceData?: {
    entryPoints: { uri: string }[];
  };
  resource?: {
    type: 'shift' | 'google';
  };
}

// Enhanced interface for selected event
interface SelectedEvent extends CalendarEvent {
  // Inherits all properties from CalendarEvent, including description and location
}

const ShiftCalendar: React.FC = () => {
  // Fetch user's time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Fetch shifts data
  const {
    data: shiftsData,
    isLoading: isShiftsLoading,
    error: shiftsError,
  } = useViewScheduleQuery();

  // Fetch Google Calendar events
  const {
    data: googleEventsData,
    refetch: refetchGoogleEvents,
    isFetching: isGoogleEventsFetching,
    error: googleEventsError,
  } = useFetchGoogleCalendarEventsQuery();

  // Mutation to create Google Calendar event
  const [createGoogleEvent, { isLoading: isCreatingEvent }] = useCreateGoogleCalendarEventMutation();

  // State to hold combined events
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // State for creating new event
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // New state
  const [includeMeetLink, setIncludeMeetLink] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(10); // Default reminder

  // New States for Event Details
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // State for viewing event details
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);

  // Helper function to combine date and time
  const combineDateAndTime = (dateString: string, timeString: string): Date => {
    const date = parseISO(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    return set(date, { hours, minutes });
  };

  // Effect to combine shifts and Google Calendar events
  useEffect(() => {
    if (shiftsData && googleEventsData) {
      const formattedShifts: CalendarEvent[] = shiftsData.shifts.map((shift: IShiftPopulated) => ({
        title: shift.shiftType?.name || 'Shift',
        start: combineDateAndTime(shift.date, shift.startTime),
        end: combineDateAndTime(shift.date, shift.endTime),
        allDay: false,
        // Adding a flag to identify shift events
        resource: { type: 'shift' },
      }));

      const formattedGoogleEvents: CalendarEvent[] = googleEventsData.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        allDay: false,
        conferenceData: event.conferenceData,
        // Adding a flag to identify Google events
        resource: { type: 'google' },
        description: event.description || '', // Include description if available
        location: event.location || '',       // Include location if available
      }));

      setEvents([...formattedShifts, ...formattedGoogleEvents]);
    }
  }, [shiftsData, googleEventsData]);

  // Function to handle syncing shifts with Google Calendar
  const handleSyncWithGoogleCalendar = async () => {
    if (shiftsData) {
      try {
        await Promise.all(
          shiftsData.shifts.map(async (shift: IShiftPopulated) => {
            const shiftStart = combineDateAndTime(shift.date, shift.startTime);
            const shiftEnd = combineDateAndTime(shift.date, shift.endTime);

            await createGoogleEvent({
              summary: shift.shiftType?.name || 'Shift',
              start: { dateTime: shiftStart.toISOString(), timeZone: userTimeZone },
              end: { dateTime: shiftEnd.toISOString(), timeZone: userTimeZone },
            }).unwrap();
          })
        );
        await refetchGoogleEvents();
        alert('Shifts synced to Google Calendar!');
      } catch (error) {
        console.error('Error syncing shifts:', error);
        alert('Failed to sync shifts to Google Calendar.');
      }
    }
  };

  // Function to handle selecting a time slot
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start);
    setSelectedEndDate(new Date(slotInfo.start.getTime() + 60 * 60 * 1000)); // Default 1 hour later
    setModalIsOpen(true);
  };

  // Function to handle selecting an event
  const handleSelectEvent = (event: SelectedEvent) => {
    setSelectedEvent(event);
    setViewModalIsOpen(true);
  };

  // Function to handle creating a new event
  const handleCreateEvent = async () => {
    if (newEventTitle && selectedDate && selectedEndDate) {
      if (selectedEndDate <= selectedDate) {
        alert('End time must be after start time.');
        return;
      }

      const eventDetails: any = {
        summary: newEventTitle,
        description: eventDescription,
        location: eventLocation,
        start: { dateTime: selectedDate.toISOString(), timeZone: userTimeZone },
        end: { dateTime: selectedEndDate.toISOString(), timeZone: userTimeZone },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: reminderMinutes }],
        },
      };

      if (includeMeetLink) {
        eventDetails.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        };
      }

      try {
        await createGoogleEvent(eventDetails).unwrap();
        await refetchGoogleEvents();

        alert('Event created successfully!');

        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEventTitle,
            start: selectedDate,
            end: selectedEndDate,
            allDay: false,
            resource: { type: 'google' },
            description: eventDescription,
            location: eventLocation,
          },
        ]);

        // Reset modal states
        setModalIsOpen(false);
        setNewEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setIncludeMeetLink(false);
        setReminderMinutes(10);
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Function to customize event styles
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#b5e48c';
    let color = '#343a40'; // White text for shifts

    if (event.resource?.type === 'google') {
      backgroundColor = '#ffffff'; // White for Google events
      color = '#1f2937'; // Dark text for Google events
      return {
        style: {
          backgroundColor,
          color,
          borderRadius: '4px',
          border: '',
          opacity: 1,
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '600',
        },
      };
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: '4px',
        opacity: 0.8,
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: '600',

      },
    };
  };

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
        

        {/* Sync Button */}
        {/* Sync Button */}
          <button
            onClick={handleSyncWithGoogleCalendar}
            className={`flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isCreatingEvent ? 'cursor-not-allowed opacity-70' : ''
            }`}
            disabled={isCreatingEvent}
            aria-label="Sync Shifts with Google Calendar"
          >
            {/* Loader or Icon */}
            {isCreatingEvent ? (
              <FaSpinner className="animate-spin w-5 h-5 text-gray-600" />
            ) : (
              <FaSyncAlt className="w-5 h-5 text-gray-600" />
            )}

            {/* Button Text */}
            <span className="text-gray-700 font-medium text-sm">
              Sync with Google Calendar
            </span>
          </button>

            </div>

      {/* Loading and Error States */}
      {(isShiftsLoading || isGoogleEventsFetching) && (
        <div className="flex justify-center items-center mb-4">
          <FaSpinner className="animate-spin text-gray-700 w-6 h-6 mr-2" />
          <span className="text-gray-700">Loading events...</span>
        </div>
      )}
      {shiftsError && <p className="mb-4 text-red-500">Error loading shifts.</p>}
      {googleEventsError && <p className="mb-4 text-red-500">Error loading Google Calendar events.</p>}

      {/* Calendar Component */}
      {!isShiftsLoading && !isGoogleEventsFetching && (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-900 font-secondary">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 720, color: '#979dac' }}
            views={['week', 'day', 'month']}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      )}

      {/* Modal for creating new event */}
      {modalIsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-event-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg mx-auto shadow-lg">
            <h2 id="create-event-title" className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Create New Event
            </h2>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Event Title"
              required
            />
            <textarea
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Event Description"
            />
            <input
              type="text"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Event Location"
            />
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-300" htmlFor="start-time">
                  Start Time:
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="Time"
                  className="border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  id="start-time"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-300" htmlFor="end-time">
                  End Time:
                </label>
                <DatePicker
                  selected={selectedEndDate}
                  onChange={(date: Date | null) => setSelectedEndDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="Time"
                  className="border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  id="end-time"
                  required
                  minDate={selectedDate || undefined} // Conditionally set minDate
                  minTime={
                    selectedDate
                      ? set(selectedDate, { hours: selectedDate.getHours(), minutes: selectedDate.getMinutes() })
                      : undefined
                  }
                  maxTime={selectedDate ? set(selectedDate, { hours: 23, minutes: 59 }) : undefined}
                />
              </div>
            </div>
            <label className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={includeMeetLink}
                onChange={() => setIncludeMeetLink(!includeMeetLink)}
                className="mr-2"
              />
              <FaVideo className="mr-2 text-blue-500" />
              Include Google Meet Link
            </label>
            <label className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
              <span className="mr-2">Reminder (minutes before):</span>
              <input
                type="number"
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(parseInt(e.target.value) || 0)}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                min={0}
                aria-label="Reminder Minutes"
              />
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleCreateEvent}
                className="flex items-center justify-center gap-2 w-full md:w-auto bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isCreatingEvent}
              >
                {isCreatingEvent ? (
                  <>
                    <FaSpinner className="animate-spin w-5 h-5" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaSyncAlt />
                    <span>Create Event</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="w-full md:w-auto bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing event details */}
      {viewModalIsOpen && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-event-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg mx-auto shadow-lg">
            <h2 id="view-event-title" className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Event Details
            </h2>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Title:</strong> {selectedEvent.title}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Description:</strong> {selectedEvent.description || 'N/A'}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Location:</strong> {selectedEvent.location || 'N/A'}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>End:</strong> {selectedEvent.end.toLocaleString()}
            </p>
            {selectedEvent.conferenceData?.entryPoints && (
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Google Meet Link:</strong>{' '}
                <a
                  href={selectedEvent.conferenceData.entryPoints[0].uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline flex items-center gap-1"
                >
                  <FaGoogle className="w-4 h-4" />
                  Join Meeting
                </a>
              </p>
            )}
            <button
              onClick={() => setViewModalIsOpen(false)}
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftCalendar;
