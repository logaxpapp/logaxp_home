import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import FormInput from './FormInput';

interface AdvancedFiltersProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    department: string;
    startDate: string;
    endDate: string;
    dueStartDate: string;
    dueEndDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    status: string;
    priority: string;
    department: string;
    startDate: string;
    endDate: string;
    dueStartDate: string;
    dueEndDate: string;
  }>>;
  onApply: () => void;
  onClear: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, setFilters, onApply, onClear }) => (
  <div className="mb-6 p-6 bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div className="border-b border-gray-300 pb-4 mb-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Advanced Filters</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Use the options below to refine your search. Leave fields empty to skip criteria.
      </p>
    </div>

    {/* Ticket Details */}
    <CollapsibleSection title="Ticket Details" description="Filter by keyword, status, priority, and department.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormInput
          label="Keyword"
          id="advSearch"
          placeholder="e.g., 'login issue', 'payment error'"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FormInput
          label="Status"
          id="advStatus"
          type="select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
          <option value="Critical">Critical</option>
        </FormInput>
        <FormInput
          label="Priority"
          id="advPriority"
          type="select"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </FormInput>
        <FormInput
          label="Department"
          id="advDepartment"
          type="select"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">All</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
        </FormInput>
      </div>
    </CollapsibleSection>

    {/* Date Filters */}
    <CollapsibleSection title="Date Filters" description="Filter by ticket creation dates.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Start Date"
          id="startDate"
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <FormInput
          label="End Date"
          id="endDate"
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>
    </CollapsibleSection>

    {/* Due Date Filters */}
    <CollapsibleSection title="Due Dates" description="Filter by ticket due dates.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Due Start Date"
          id="dueStartDate"
          type="date"
          value={filters.dueStartDate}
          onChange={(e) => setFilters({ ...filters, dueStartDate: e.target.value })}
        />
        <FormInput
          label="Due End Date"
          id="dueEndDate"
          type="date"
          value={filters.dueEndDate}
          onChange={(e) => setFilters({ ...filters, dueEndDate: e.target.value })}
        />
      </div>
    </CollapsibleSection>

    {/* Buttons */}
    <div className="mt-8 flex flex-wrap justify-end gap-4">
      <button
        onClick={onClear}
        className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md font-semibold transition"
      >
        Clear Filters
      </button>
      <button
        onClick={onApply}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition"
      >
        Apply Filters
      </button>
    </div>
  </div>
);

export default AdvancedFilters;
