import React, { useState } from 'react';
import { useGetShiftsQuery } from '../../api/shiftApi'; 
import { IShift } from '../../types/shift';

interface Props {
  onChange: (shift: IShift | null) => void;
}

const FilterByShiftDropdown: React.FC<Props> = ({ onChange }) => {
  const { data, isLoading } = useGetShiftsQuery({});
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  // Extract the shifts array safely
  const shifts = data?.shifts || [];

  console.log('Shifts:', shifts); // For debugging purposes

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const shiftId = event.target.value;
    const shift = shifts.find((s) => s._id === shiftId) || null;
    setSelectedShift(shiftId);
    onChange(shift);
  };

  return (
    <div className="mb-4 font-secondary">
      <label htmlFor="shift-filter" className="block text-sm font-medium text-gray-700">
        Filter by Shift
      </label>
      <select
        id="shift-filter"
        value={selectedShift || ''}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select a shift</option>
        {isLoading && <option>Loading...</option>}
        {!isLoading &&
          shifts.map((shift) => (
            <option key={shift._id} value={shift._id}>
              {shift.shiftType?.name || 'Unnamed Shift'} ({new Date(shift.date).toLocaleDateString()})
            </option>
          ))}
      </select>
    </div>
  );
};

export default FilterByShiftDropdown;
