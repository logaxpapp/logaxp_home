import React, { useState, useEffect } from 'react';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import Button from '../common/Button/Button';
import { useUpdateTimeEntryMutation, useAdminUpdateTimeEntryMutation } from '../../api/timeEntryApiSlice';
import { ITimeEntry, ITimeEntryUpdate } from '../../types/timeEntry';

interface UpdateTimeEntryFormProps {
  timeEntry: ITimeEntry;
  onClose: () => void;
  employees: { value: string; label: string }[];
  shifts: { value: string; label: string }[];
}

const UpdateTimeEntryForm: React.FC<UpdateTimeEntryFormProps> = ({
    timeEntry,
    onClose,
    employees,
    shifts,
  }) => {
    const [employee, setEmployee] = useState<string | null>(null);
    const [shift, setShift] = useState<string | null>(null);
    const [clockIn, setClockIn] = useState('');
    const [clockOut, setClockOut] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [updateTimeEntry, { isLoading }] = useAdminUpdateTimeEntryMutation();
  
    useEffect(() => {
      if (timeEntry) {
        setEmployee(typeof timeEntry.employee === 'object' ? timeEntry.employee._id : timeEntry.employee);
        setShift(typeof timeEntry.shift === 'object' ? timeEntry.shift._id : timeEntry.shift);
        setClockIn(
          timeEntry.clockIn ? new Date(timeEntry.clockIn).toISOString().slice(0, 16) : ''
        );
        setClockOut(
          timeEntry.clockOut ? new Date(timeEntry.clockOut).toISOString().slice(0, 16) : ''
        );
      }
    }, [timeEntry]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!employee || !shift || !clockIn) {
        setError('All required fields must be filled.');
        return;
      }
  
      if (clockOut && new Date(clockOut) < new Date(clockIn)) {
        setError('Clock-out time cannot be earlier than clock-in time.');
        return;
      }
  
      try {
        setError(null);
        const updates: ITimeEntryUpdate = {
          employee,
          shift,
          clockIn,
          clockOut: clockOut || undefined,
          status: clockOut ? 'clockedOut' : 'clockedIn',
        };
  
        await updateTimeEntry({ id: timeEntry._id, updates }).unwrap();
        onClose();
      } catch (err) {
        setError('Failed to update the time entry. Please try again.');
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Update Time Entry
          </h2>
  
          {error && <p className="text-red-500 mb-4">{error}</p>}
  
          <SingleSelect
            label="Employee"
            value={employee}
            onChange={setEmployee}
            options={employees}
            placeholder="Select Employee"
            isDisabled={true}
          />
  
          <SingleSelect
            label="Shift"
            value={shift}
            onChange={setShift}
            options={shifts}
            placeholder="Select Shift"
          />
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Clock In</label>
            <input
              type="datetime-local"
              value={clockIn}
              onChange={(e) => setClockIn(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clock Out (Optional)
            </label>
            <input
              type="datetime-local"
              value={clockOut}
              onChange={(e) => setClockOut(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
  
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    );
  };
  
  export default UpdateTimeEntryForm;
  