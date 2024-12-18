// src/components/EmployeeTimeEntryList/FilterByEmployeeDropdown.tsx

import React from 'react';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import { useFetchEmployeesQuery } from '../../api/usersApi';

interface FilterByEmployeeDropdownProps {
  value: string | null; // Controlled value
  onChange: (employeeId: string | null) => void;
  className?: string; // Optional className prop
}

const FilterByEmployeeDropdown: React.FC<FilterByEmployeeDropdownProps> = ({
  value,
  onChange,
  className, // Destructure className
}) => {
  const { data: employees, isLoading, isError } = useFetchEmployeesQuery();

  const options =
    employees?.map((employee) => ({
      value: employee.employee_id,
      label: `${employee.name} (${employee.employee_id})`,
    })) || [];

  // Handle error state
  if (isError) {
    return <p className="text-red-500">Failed to load employees. Please try again later.</p>;
  }

  return (
    <div className={className}> {/* Apply className here */}
      <SingleSelect
        label="Filter by Employee"
        options={options}
        value={value} // Controlled value
        onChange={onChange}
        isLoading={isLoading}
        placeholder="Select an Employee"

      />
    </div>
  );
};

export default FilterByEmployeeDropdown;
