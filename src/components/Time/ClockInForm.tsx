import React, { useEffect, useState } from 'react';
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
import { FiClock, FiCoffee, FiLogOut, FiLogIn } from 'react-icons/fi';

const ClockInOutForm: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<'clockedIn' | 'clockedOut' | 'onBreak' | null>(null);
  const [selectedTimeEntryId, setSelectedTimeEntryId] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  const [createTimeEntry] = useCreateTimeEntryMutation();
  const [updateTimeEntry] = useUpdateTimeEntryMutation();
  const [startBreak] = useStartBreakMutation();
  const [endBreak] = useEndBreakMutation();

  const { data: currentStatusData, refetch, isFetching } = useFetchCurrentStatusQuery(
    currentUser?.employee_id || '',
    { skip: !currentUser?.employee_id }
  );

  useEffect(() => {
    if (currentStatusData) {
      setCurrentStatus(currentStatusData.currentStatus);
      setSelectedTimeEntryId(currentStatusData.timeEntryId || null);
      setSelectedShift(currentStatusData.shift?._id || null);
      setLoading(false);
    } else if (!isFetching) {
      setLoading(false);
    }
  }, [currentStatusData, isFetching]);

  // Calculate Total Hours
  const calculateTotalHours = () => {
    if (!currentStatusData?.shift?.startTime || !currentStatusData?.shift?.date) return 'N/A';

    try {
      const [hours, minutes] = currentStatusData.shift.startTime.split(':').map(Number);
      const clockInTime = new Date(currentStatusData.shift.date);
      clockInTime.setHours(hours, minutes, 0, 0);

      const currentTime = new Date();
      const diffInMs = currentTime.getTime() - clockInTime.getTime();

      if (diffInMs < 0) return '0:00';

      const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const totalMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${totalHours}:${totalMinutes < 10 ? '0' : ''}${totalMinutes}`;
    } catch (error) {
      console.error('Error calculating total hours:', error);
      return 'N/A';
    }
  };

  const handleClockIn = async () => {
    if (!currentUser) {
      showToast('User not logged in.', 'error');
      return;
    }

    try {
      const response = await createTimeEntry({
        employeeId: currentUser._id,
        shiftId: selectedShift || undefined,
        clockIn: new Date().toISOString(),
      });

      if (response.data) {
        setSelectedTimeEntryId(response.data._id);
        setCurrentStatus('clockedIn');
        showToast('Clock-In Successful', 'success');
        refetch();
      }
    } catch (error) {
      showToast(`Failed to Clock-In: ${(error as any).message}`, 'error');
    }
  };

  const handleClockOut = async () => {
    try {
      let timeEntryId = selectedTimeEntryId;
      if (!timeEntryId) {
        const statusResponse = await refetch();
        if (
          statusResponse.data?.currentStatus === 'clockedIn' &&
          statusResponse.data?.timeEntryId
        ) {
          timeEntryId = statusResponse.data.timeEntryId;
          setSelectedTimeEntryId(timeEntryId);
        } else {
          showToast('Error: No active time entry found. Please clock in first.', 'error');
          return;
        }
      }

      const response = await updateTimeEntry({
        id: timeEntryId!,
        updates: { clockOut: new Date().toISOString(), status: 'clockedOut' },
      });

      if (response.data) {
        setCurrentStatus('clockedOut');
        setSelectedTimeEntryId(null);
        showToast('Clock-Out Successful', 'success');
        refetch();
      }
    } catch (error) {
      showToast('Failed to Clock-Out: ' + (error as any).message, 'error');
    }
  };

  const handleStartBreak = async () => {
    if (!selectedTimeEntryId) {
      showToast('Please clock in first.', 'error');
      return;
    }

    try {
      const response = await startBreak(selectedTimeEntryId);
      if (response.data) {
        setCurrentStatus('onBreak');
        showToast('Break Started Successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to Start Break: ' + (error as any).message, 'error');
    }
  };

  const handleEndBreak = async () => {
    if (!selectedTimeEntryId) {
      showToast('Please clock in first.', 'error');
      return;
    }

    try {
      const response = await endBreak(selectedTimeEntryId);
      if (response.data) {
        setCurrentStatus('clockedIn');
        showToast('Break Ended Successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to End Break: ' + (error as any).message, 'error');
    }
  };

  if (loading || isFetching) {
    return (
      <div className="p-8 bg-gray-100 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-blue-500">Loading...</h2>
        <p className="text-gray-600 mt-4">Please wait while we fetch your status.</p>
      </div>
    );
  }

  return (
    <header className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl font-semibold font-primary">
          Hey, <span className="text-blue-600">{currentUser?.name}</span> 👋
        </h1>
        <p className="text-sm text-gray-500">Welcome to your dashboard</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {currentStatus === 'clockedIn' && (
          <>
            <div className="text-center">
              <span className="block text-sm text-gray-500">Clock In Time</span>
              <span className="font-semibold">{currentStatusData?.shift?.startTime || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm text-gray-500">Current Time</span>
              <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm text-gray-500">Total Hours</span>
              <span className="font-semibold">{calculateTotalHours()}</span>
            </div>
          </>
        )}

        <div className="flex space-x-4 text-sm">
          {currentStatus === 'clockedOut' ? (
            <button
              className="flex items-center px-4 py-2 bg-lemonGreen-light text-white text-sm rounded-md hover:bg-blue-700 transition"
              onClick={handleClockIn}
            >
              <FiLogIn className="mr-2" />
              Clock In
            </button>
          ) : (
            <>
              <button
                className="flex items-center px-4 py-3 bg-lemonGreen-light text-white text-sm rounded-md hover:bg-gray-800 transition"
                onClick={handleClockOut}
              >
                <FiLogOut className="mr-2" />
                Clock Out
              </button>
              <button
                className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                onClick={currentStatus === 'onBreak' ? handleEndBreak : handleStartBreak}
              >
                <FiCoffee className="mr-2" />
                {currentStatus === 'onBreak' ? 'End Break' : 'Break'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClockInOutForm;
