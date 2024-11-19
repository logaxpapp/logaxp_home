import React, { useState } from 'react';
import { ITimeEntry, ITimeEntryUpdate } from '../../types/timeEntry';
import Modal from '../common/Feedback/Modal';

interface EditTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntry: ITimeEntry | null;
  onSave: (updates: ITimeEntryUpdate) => void;
}

const EditTimeEntryModal: React.FC<EditTimeEntryModalProps> = ({
  isOpen,
  onClose,
  timeEntry,
  onSave,
}) => {
  const [clockIn, setClockIn] = useState(timeEntry?.clockIn || '');
  const [clockOut, setClockOut] = useState(timeEntry?.clockOut || '');

  const handleSave = () => {
    onSave({ clockIn: clockIn ? new Date(clockIn).toISOString() : undefined, clockOut: clockOut ? new Date(clockOut).toISOString() : undefined });
    onClose();
  };

  if (!timeEntry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold mb-4">Edit Time Entry</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium">Clock In</label>
        <input
          type="datetime-local"
          value={new Date(clockIn).toISOString().slice(0, 16)}
          onChange={(e) => setClockIn(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Clock Out</label>
        <input
          type="datetime-local"
          value={clockOut ? new Date(clockOut).toISOString().slice(0, 16) : ''}
          onChange={(e) => setClockOut(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditTimeEntryModal;
