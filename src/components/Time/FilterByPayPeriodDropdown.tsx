import React, { useState } from 'react';
import { useFetchAllPayPeriodsQuery } from '../../api/payPeriodApiSlice';
import { IPayPeriod } from '../../types/payPeriodTypes';

interface Props {
  onChange: (payPeriod: IPayPeriod | null) => void;
}

const FilterByPayPeriodDropdown: React.FC<Props> = ({ onChange }) => {
  const { data: payPeriods, isLoading } = useFetchAllPayPeriodsQuery();
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const payPeriodId = event.target.value;
    const payPeriod = payPeriods?.find((p) => p._id === payPeriodId) || null;
    setSelectedPayPeriod(payPeriodId);
    onChange(payPeriod);
  };

  return (
    <div className="mb-4">
      <label htmlFor="pay-period-filter" className="block text-sm font-medium text-gray-700">
        Filter by Pay Period
      </label>
      <select
        id="pay-period-filter"
        value={selectedPayPeriod || ''}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select a pay period</option>
        {isLoading && <option>Loading...</option>}
        {payPeriods &&
          payPeriods.map((period) => (
            <option key={period._id} value={period._id}>
              {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
            </option>
          ))}
      </select>
    </div>
  );
};

export default FilterByPayPeriodDropdown;
