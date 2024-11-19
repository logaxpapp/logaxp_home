import React, { useState } from 'react';
import Button from '../common/Button/Button';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import MultiSelect from '../common/Input/SelectDropdown/MultiSelect';
import { IShift, ShiftStatus, IShiftType } from '../../types/shift';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';
import { useFetchAllPayPeriodsQuery } from '../../api/apiSlice';
import {  useGetShiftTypesQuery } from '../../api/shiftApi';
import { IUser } from '../../types/user';


interface CreateShiftFormProps {
  onSubmit: (shiftData: Partial<IShift>) => void;
  onCancel: () => void;
}

const CreateShiftForm: React.FC<CreateShiftFormProps> = ({ onSubmit, onCancel }) => {
  const { data: shiftTypes, isLoading: isShiftTypesLoading } = useGetShiftTypesQuery();
  const { data: payPeriods, isLoading: isPayPeriodsLoading } = useFetchAllPayPeriodsQuery();

  const [shiftType, setShiftType] = useState<string | null>(null);
  const [payPeriod, setPayPeriod] = useState<string | null>(null); // New state for PayPeriod
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [applicationManaged, setApplicationManaged] = useState<string[]>([]);
  const [isExcess, setIsExcess] = useState(false);

  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shiftType || !date || !startTime || !endTime || applicationManaged.length === 0 || !payPeriod) {
      showToast('Please fill in all required fields');
      return;
    }

    const selectedShiftType: IShiftType | undefined = shiftTypes?.find((type) => type._id === shiftType);

    const shiftData: Partial<IShift> = {
      shiftType: selectedShiftType as IShiftType,
      date,
      startTime,
      endTime,
      applicationManaged,
      isExcess,
      status: ShiftStatus.Open,
      createdBy: currentUser as IUser, // Ensure currentUser is fully typed
      payPeriod, 
    };

    try {
      onSubmit(shiftData);
      showToast('Shift created successfully', 'success');
    } catch (error) {
      console.error('Error creating shift:', error);
      showToast('Failed to create shift', 'error');
    }
  };

  const shiftTypeOptions = shiftTypes?.map((type) => ({
    value: type._id,
    label: type.name,
  })) || [];

  const payPeriodOptions = payPeriods?.map((pp) => ({
    value: pp._id,
    label: `${new Date(pp.startDate).toLocaleDateString()} - ${new Date(pp.endDate).toLocaleDateString()}`,
  })) || [];

  return (
    <form onSubmit={handleSubmit}>
      <SingleSelect
        label="Shift Type"
        options={shiftTypeOptions}
        value={shiftType}
        onChange={setShiftType}
        placeholder="Select Shift Type"
        required
      />
      <SingleSelect
        label="Pay Period" // New field
        options={payPeriodOptions}
        value={payPeriod}
        onChange={setPayPeriod}
        placeholder="Select Pay Period"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded p-2"
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
      <div className="mb-4 flex items-center dark:text-gray-50">
        <input
          type="checkbox"
          checked={isExcess}
          onChange={(e) => setIsExcess(e.target.checked)}
          className="form-checkbox h-4 w-4 text-lemonGreen"
        />
        <label className="ml-2 text-gray-700 dark:text-gray-50">Is Excess Shift</label>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Shift
        </Button>
      </div>
    </form>
  );
};

export default CreateShiftForm;
