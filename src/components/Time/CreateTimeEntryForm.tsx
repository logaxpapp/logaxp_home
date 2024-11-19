import React, { useState } from 'react';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import Button from '../common/Button/Button';
import { useCreateTimeEntryMutation } from '../../api/timeEntryApiSlice';

const CreateTimeEntryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [employee, setEmployee] = useState<string | null>(null); // Correct property for employee
  const [shift, setShift] = useState<string | null>(null); // Correct property for shift
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [createTimeEntry] = useCreateTimeEntryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !shift || !clockIn) {
      alert('Please fill in all required fields');
      return;
    }

    // Correct property names to match the backend API expectations
    await createTimeEntry({
      employeeId: employee, // Use "employee" instead of "employeeId"
      shiftId: shift, // Use "shift" instead of "shiftId"
      clockIn: clockIn,
      clockOut: clockOut || undefined,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Create Time Entry</h2>
      <SingleSelect
        label="Employee"
        value={employee}
        onChange={setEmployee}
        options={[
          { value: '1', label: 'Employee 1' },
          { value: '2', label: 'Employee 2' },
        ]}
        placeholder="Select Employee"
        required
      />
      <SingleSelect
        label="Shift"
        value={shift}
        onChange={setShift}
        options={[
          { value: '1', label: 'Morning Shift' },
          { value: '2', label: 'Evening Shift' },
        ]}
        placeholder="Select Shift"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium">Clock In</label>
        <input
          type="datetime-local"
          value={clockIn}
          onChange={(e) => setClockIn(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Clock Out (Optional)</label>
        <input
          type="datetime-local"
          value={clockOut}
          onChange={(e) => setClockOut(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CreateTimeEntryForm;
