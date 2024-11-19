// src/components/PayPeriod/CreateMultipleShiftsForm.tsx

import React, { useState } from 'react';
import {  useFetchAllPayPeriodsQuery } from '../../api/apiSlice';
import { useGetShiftTypesQuery } from '../../api/shiftApi';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import MultiSelect from '../common/Input/SelectDropdown/MultiSelect';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';
import Button from '../common/Button/Button';

interface CreateMultipleShiftsFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreateMultipleShiftsForm: React.FC<CreateMultipleShiftsFormProps> = ({ onSubmit, onCancel }) => {
  const { data: shiftTypes, isLoading: isShiftTypesLoading } = useGetShiftTypesQuery();
  const { data: payPeriods, isLoading: isPayPeriodsLoading } = useFetchAllPayPeriodsQuery();

  const [shiftType, setShiftType] = useState<string | null>(null);
  const [payPeriod, setPayPeriod] = useState<string | null>(null); // New state for PayPeriod
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [applicationManaged, setApplicationManaged] = useState<string[]>([]);
  const [repeatDaily, setRepeatDaily] = useState(false);

  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!shiftType || !startDate || !endDate || !startTime || !endTime || applicationManaged.length === 0 || !payPeriod) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Prepare shift data
    const shiftData = {
      shiftTypeId: shiftType,
      payPeriod, // Include PayPeriod ID in the submission
      startDate,
      endDate,
      startTime,
      endTime,
      applicationManaged,
      repeatDaily,
      createdBy: currentUser?._id,
    };

    try {
      onSubmit(shiftData);
      showToast('Shifts created successfully', 'success');
    } catch (error) {
      console.error('Failed to create shifts:', error);
      showToast('Failed to create shifts', 'error');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shift Type */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Shift Type<span className="text-red-500">*</span></label>
          <SingleSelect
            options={shiftTypeOptions}
            value={shiftType}
            onChange={setShiftType}
            placeholder="Select Shift Type"
            required
          />
        </div>

        {/* Pay Period */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Pay Period<span className="text-red-500">*</span></label>
          <SingleSelect
            options={payPeriodOptions}
            value={payPeriod}
            onChange={setPayPeriod}
            placeholder="Select Pay Period"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Time<span className="text-red-500">*</span></label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">End Time<span className="text-red-500">*</span></label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      {/* Applications Managed */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Applications Managed<span className="text-red-500">*</span></label>
        <MultiSelect
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
      </div>

      {/* Repeat Daily */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={repeatDaily}
          onChange={(e) => setRepeatDaily(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-gray-700 dark:text-gray-300">
          Repeat Daily
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button onClick={onCancel} type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateMultipleShiftsForm;
