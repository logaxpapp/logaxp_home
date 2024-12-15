// src/components/ShiftList/EditShiftForm.tsx

import React, { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import { IShiftType, IShift, ShiftStatus } from '../../types/shift';
import SingleSelect from '../common/Input/SelectDropdown/TypedSingleSelect';
import MultiSelect from '../common/Input/SelectDropdown/MultiSelect';
import { useGetShiftTypesQuery } from '../../api/shiftApi';

interface EditShiftFormProps {
  shift: IShift;
  onSubmit: (updates: Partial<IShift>) => void;
  onCancel: () => void;
}

const EditShiftForm: React.FC<EditShiftFormProps> = ({ shift, onSubmit, onCancel }) => {
  const { data: shiftTypes, isLoading: isShiftTypesLoading } = useGetShiftTypesQuery();

  const [shiftType, setShiftType] = useState<IShiftType | null>(shift.shiftType);
  const [date, setDate] = useState<string>(new Date(shift.date).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(shift.startTime);
  const [endTime, setEndTime] = useState(shift.endTime);
  const [applicationManaged, setApplicationManaged] = useState<string[]>(shift.applicationManaged);
  const [isExcess, setIsExcess] = useState<boolean>(shift.isExcess || false);
  const [status, setStatus] = useState<ShiftStatus>(shift.status);

  useEffect(() => {
    setShiftType(shift.shiftType);
    setDate(new Date(shift.date).toISOString().slice(0, 10));
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setApplicationManaged(shift.applicationManaged);
    setIsExcess(shift.isExcess || false);
    setStatus(shift.status);
  }, [shift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shiftType && date && startTime && endTime && applicationManaged) {
      onSubmit({
        shiftType: shiftType, // Pass the full IShiftType object
        date,
        startTime,
        endTime,
        applicationManaged,
        isExcess,
        status,
      });
    }
  };

  const shiftTypeOptions = shiftTypes?.map((type) => ({
    value: type,
    label: type.name,
  })) || [];

  const statusOptions = Object.values(ShiftStatus).map((status) => ({
    value: status,
    label: status,
  }));

  const handleStatusChange = (value: ShiftStatus | null) => {
    if (value !== null) {
      setStatus(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SingleSelect<IShiftType>
          label="Shift Type"
          options={shiftTypeOptions}
          value={shiftType}
          onChange={setShiftType}
          placeholder="Select Shift Type"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
      </div>

      <MultiSelect
        label="Applications Managed"
        options={[
          { value: 'Loga Beauty', label: 'Loga Beauty' },
          { value: 'GatherPlux', label: 'GatherPlux' },
          { value: 'TimeSync', label: 'TimeSync' },
          { value: 'BookMiz', label: 'BookMiz' },
        ]}
        value={applicationManaged}
        onChange={setApplicationManaged}
        placeholder="Select Applications"
      />

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={isExcess}
          onChange={(e) => setIsExcess(e.target.checked)}
          className="form-checkbox h-4 w-4 text-lemonGreen"
        />
        <label className="ml-2 text-gray-700">Is Excess Shift</label>
      </div>

      <SingleSelect<ShiftStatus>
        label="Status"
        options={statusOptions}
        value={status}
        onChange={handleStatusChange}
        placeholder="Select Status"
        required
      />

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isShiftTypesLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditShiftForm;
