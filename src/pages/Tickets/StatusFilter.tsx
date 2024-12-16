// src/components/Ticket/Filters/StatusFilter.tsx
import React from 'react';

interface StatusFilterProps {
  statusFilter: string;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, onStatusChange }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-700" htmlFor="statusFilter">
      Status:
    </label>
    <select
      id="statusFilter"
      value={statusFilter}
      onChange={onStatusChange}
      className="h-10 pl-3 pr-8 rounded-full border border-gray-300 bg-white text-gray-600 focus:outline-none"
    >
      <option value="All">All</option>
      <option value="Open">Open</option>
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
      <option value="Closed">Closed</option>
      <option value="Critical">Critical</option>
    </select>
  </div>
);

export default StatusFilter;
