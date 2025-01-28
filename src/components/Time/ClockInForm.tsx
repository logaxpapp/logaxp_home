import React, { useEffect, useState, useRef } from 'react';
import {
  useStartBreakMutation,
  useEndBreakMutation,
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useFetchCurrentStatusQuery,
} from '../../api/timeEntryApiSlice';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';

import { FiCoffee, FiLogOut, FiLogIn } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';

interface CurrentStatusData {
  currentStatus: 'clockedIn' | 'clockedOut' | 'onBreak' | 'absent';
  timeEntryId: string;
  // Optional: you might also return a "clockIn" field directly from the backend
  clockIn?: string; // e.g., "2025-01-28T11:59:00Z"
  shift?: {
    _id: string;
    date: string;      // e.g., "2025-01-28"
    startTime: string; // e.g., "11:59"
    endTime?: string;
  };
  activeBreak?: {
    breakStart: string;
    breakEnd: string | null;
  } | null;
}

const ClockInOutForm: React.FC = () => {
  // Track the big statuses
  const [currentStatus, setCurrentStatus] = useState<'clockedIn' | 'clockedOut' | 'onBreak' | 'absent' | null>(null);
  const [selectedTimeEntryId, setSelectedTimeEntryId] = useState<string | null>(null);

  // We'll store the *exact* clockIn time from the backend
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  // If the backend returns a shiftId or not
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // For “live” hour counter
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modal for daily note on clock-out
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState<boolean>(false);
  const [dailyNote, setDailyNote] = useState<string>('');

  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  // ==================== RTK Query Hooks ====================
  const [createTimeEntry] = useCreateTimeEntryMutation();
  const [updateTimeEntry] = useUpdateTimeEntryMutation();
  const [startBreak] = useStartBreakMutation();
  const [endBreak] = useEndBreakMutation();

  // ---- INCLUDE refetch IN THE DESTRUCTURE ----
  const {
    data: currentStatusData,
    error: currentStatusError,
    isFetching,
    refetch, // <-- fix: we include `refetch` now
  } = useFetchCurrentStatusQuery(currentUser?.employee_id || '', {
    skip: !currentUser?.employee_id,
  });

  // ------------------------------ useEffect: Set Current Status ------------------------------
  useEffect(() => {
    // 1) If there's a 404 from the backend => user has no active time entry => default to "clockedOut"
    if (
      currentStatusError &&
      'status' in currentStatusError &&
      currentStatusError.status === 404
    ) {
      setCurrentStatus('clockedOut');
      setSelectedTimeEntryId(null);
      setSelectedShift(null);
      setClockInTime(null);
      setLoading(false);
      return;
    }

    // 2) If we got data back, update states
    if (currentStatusData) {
      setCurrentStatus(currentStatusData.currentStatus);
      setSelectedTimeEntryId(currentStatusData.timeEntryId || null);
      setSelectedShift(currentStatusData.shift?._id || null);
      setClockInTime(currentStatusData.clockIn || null); // If the API returns clockIn

      setLoading(false);
    }
    // 3) If there's no data and no error => default to "clockedOut"
    else if (!isFetching) {
      setCurrentStatus('clockedOut');
      setSelectedTimeEntryId(null);
      setSelectedShift(null);
      setClockInTime(null);
      setLoading(false);
    }
  }, [currentStatusData, currentStatusError, isFetching]);

  // ------------------------------ useEffect: Start/Stop Live Timer ------------------------------
  useEffect(() => {
    if (currentStatus === 'clockedIn' || currentStatus === 'onBreak') {
      startTimer();
    } else {
      stopTimer();
      setElapsedTime('00:00:00');
    }
    return () => stopTimer();
  }, [currentStatus]);

  // ------------------------------ Timer Logic ------------------------------
  const startTimer = () => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      updateElapsedTime();
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateElapsedTime = () => {
    try {
      if (!clockInTime) {
        setElapsedTime('00:00:00');
        return;
      }
      const clockInDate = new Date(clockInTime);
      const now = new Date();
      let diffMs = now.getTime() - clockInDate.getTime();
      if (diffMs < 0) diffMs = 0;

      const totalSeconds = Math.floor(diffMs / 1000);
      const hh = Math.floor(totalSeconds / 3600);
      const mm = Math.floor((totalSeconds % 3600) / 60);
      const ss = totalSeconds % 60;

      setElapsedTime(
        [hh, mm, ss].map((val) => String(val).padStart(2, '0')).join(':')
      );
    } catch (err) {
      console.error('Error calculating elapsed time:', err);
      setElapsedTime('00:00:00');
    }
  };

  // ------------------------------ CLOCK IN ------------------------------
  const handleClockIn = async () => {
    if (!currentUser) {
      showToast('User not logged in.', 'error');
      return;
    }

    try {
      const nowIsoString = new Date().toISOString();
      const response: any = await createTimeEntry({
        employeeId: currentUser._id,
        shiftId: selectedShift || undefined,
        clockIn: nowIsoString,
      });

      if (response.error) {
        showToast(`Failed to Clock-In: ${response.error.data?.message}`, 'error');
        return;
      }

      if (response.data) {
        // response.data should be the newly created timeEntry
        setSelectedTimeEntryId(response.data._id);
        setCurrentStatus('clockedIn');
        setClockInTime(response.data.clockIn || nowIsoString);
        showToast('Clock-In Successful', 'success');

        // <-- Now we can safely call refetch
        refetch();
      }
    } catch (error: any) {
      showToast(`Failed to Clock-In: ${error.message}`, 'error');
    }
  };

  // ------------------------------ OPEN CLOCK-OUT MODAL ------------------------------
  const openClockOutModal = () => {
    if (!selectedTimeEntryId) {
      showToast('No active time entry found. Cannot clock out.', 'error');
      return;
    }
    setIsClockOutModalOpen(true);
  };

  const closeClockOutModal = () => {
    setIsClockOutModalOpen(false);
    setDailyNote('');
  };

  // ------------------------------ CONFIRM CLOCK OUT ------------------------------
  const confirmClockOut = async () => {
    if (!selectedTimeEntryId) {
      showToast('No active time entry found. Cannot clock out.', 'error');
      return;
    }
    if (!dailyNote.trim()) {
      showToast('Please add your daily note before clocking out.', 'error');
      return;
    }

    try {
      const nowIsoString = new Date().toISOString();
      const response: any = await updateTimeEntry({
        id: selectedTimeEntryId,
        updates: {
          clockOut: nowIsoString,
          status: 'clockedOut',
          dailyNote: dailyNote,
        },
      });

      if (response.error) {
        showToast(`Failed to Clock-Out: ${response.error.data?.message}`, 'error');
        return;
      }
      if (response.data?.timeEntry) {
        setCurrentStatus('clockedOut');
        setSelectedTimeEntryId(null);
        setClockInTime(null); // Clear out
        showToast('Clock-Out Successful', 'success');
        refetch();
      }
    } catch (error: any) {
      showToast(`Failed to Clock-Out: ${error.message}`, 'error');
    } finally {
      closeClockOutModal();
    }
  };

  // ------------------------------ START BREAK ------------------------------
  const handleStartBreak = async () => {
    if (!selectedTimeEntryId) {
      showToast('Please clock in first.', 'error');
      return;
    }
    try {
      const response: any = await startBreak(selectedTimeEntryId);
      if (response.error) {
        showToast(`Failed to Start Break: ${response.error.data?.message}`, 'error');
        return;
      }
      if (response.data) {
        setCurrentStatus('onBreak');
        showToast('Break Started Successfully', 'success');
      }
    } catch (error: any) {
      showToast(`Failed to Start Break: ${error.message}`, 'error');
    }
  };

  // ------------------------------ END BREAK ------------------------------
  const handleEndBreak = async () => {
    if (!selectedTimeEntryId) {
      showToast('Please clock in first.', 'error');
      return;
    }
    try {
      const response: any = await endBreak(selectedTimeEntryId);
      if (response.error) {
        showToast(`Failed to End Break: ${response.error.data?.message}`, 'error');
        return;
      }
      if (response.data) {
        setCurrentStatus('clockedIn');
        showToast('Break Ended Successfully', 'success');
      }
    } catch (error: any) {
      showToast(`Failed to End Break: ${error.message}`, 'error');
    }
  };

  // ------------------------------ LOADING STATE ------------------------------
  if (loading || isFetching) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-blue-600">Loading...</h2>
        <p className="text-gray-600 mt-4">Please wait while we fetch your status...</p>
      </div>
    );
  }

  // ------------------------------ RENDER ------------------------------
  return (
    <>
      <header className="p-4 bg-blue-800 text-white rounded-lg shadow flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold">
            Hey, <span className="text-yellow-300">{currentUser?.name}</span> 👋
          </h1>
          <p className="text-sm text-gray-100">Welcome to your dashboard</p>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8">
          {/* Show these details only if we are clocked in or on break */}
          {(currentStatus === 'clockedIn' || currentStatus === 'onBreak') && (
            <>
              <div className="text-center">
                <span className="block text-xs uppercase opacity-80">Clock In Time</span>
                <span className="font-bold text-lg">
                  {clockInTime ? new Date(clockInTime).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase opacity-80">Current Time</span>
                <span className="font-bold text-lg">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase opacity-80">Total Hours</span>
                <span className="font-bold text-lg">{elapsedTime}</span>
              </div>
            </>
          )}

          {/* Clock In / Out / Break Buttons */}
          <div className="flex items-center space-x-2">
            {currentStatus === 'clockedOut' || currentStatus === 'absent' ? (
              <button
                className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded flex items-center"
                onClick={handleClockIn}
              >
                <FiLogIn className="mr-2" />
                Clock In
              </button>
            ) : (
              <>
                {currentStatus === 'clockedIn' && (
                  <button
                    className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded flex items-center"
                    onClick={openClockOutModal}
                  >
                    <FiLogOut className="mr-2" />
                    Clock Out
                  </button>
                )}
                {(currentStatus === 'clockedIn' || currentStatus === 'onBreak') && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-2 rounded flex items-center"
                    onClick={currentStatus === 'onBreak' ? handleEndBreak : handleStartBreak}
                  >
                    <FiCoffee className="mr-2" />
                    {currentStatus === 'onBreak' ? 'End Break' : 'Break'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Clock-Out Modal */}
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        open={isClockOutModalOpen}
        onClose={closeClockOutModal}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Dialog.Panel className="relative bg-white w-full max-w-md mx-auto rounded-md shadow-lg p-6">
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-2">Daily Note</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Provide a summary of what you did today before clocking out.
          </Dialog.Description>

          <textarea
            className="w-full h-32 border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dailyNote}
            onChange={(e) => setDailyNote(e.target.value)}
            placeholder="E.g., completed tasks X, Y, Z..."
          />

          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              onClick={closeClockOutModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={confirmClockOut}
            >
              Submit &amp; Clock Out
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ClockInOutForm;
