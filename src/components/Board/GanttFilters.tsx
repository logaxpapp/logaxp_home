// src/components/Board/GanttFilters.tsx

import React from 'react';

interface GanttFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterProgress: number | 'All';
  setFilterProgress: (value: number | 'All') => void;
  filterStartDateFrom: string;
  setFilterStartDateFrom: (value: string) => void;
  filterStartDateTo: string;
  setFilterStartDateTo: (value: string) => void;
  filterDueDateFrom: string;
  setFilterDueDateFrom: (value: string) => void;
  filterDueDateTo: string;
  setFilterDueDateTo: (value: string) => void;
  resetFilters: () => void;
}

const GanttFilters: React.FC<GanttFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterProgress,
  setFilterProgress,
  filterStartDateFrom,
  setFilterStartDateFrom,
  filterStartDateTo,
  setFilterStartDateTo,
  filterDueDateFrom,
  setFilterDueDateFrom,
  filterDueDateTo,
  setFilterDueDateTo,
  resetFilters,
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded shadow-sm h-auto sidebar text-gray-700 w-full md:w-80">
      <h3 className="text-md font-semibold mb-2">Search and Filters</h3>
      <div className="grid grid-cols-1 text-xs gap-4">
        {/* Search by Title */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search by Title
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter task title"
          />
        </div>

        {/* Filter by Progress */}
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
            Filter by Progress
          </label>
          <select
            id="progress"
            value={filterProgress}
            onChange={(e) => {
              const value = e.target.value;
              setFilterProgress(value === 'All' ? 'All' : Number(value));
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value={0}>0%</option>
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
          </select>
        </div>

        {/* Filter by Start Date From */}
        <div>
          <label htmlFor="startDateFrom" className="block text-sm font-medium text-gray-700">
            Start Date From
          </label>
          <input
            type="date"
            id="startDateFrom"
            value={filterStartDateFrom}
            onChange={(e) => setFilterStartDateFrom(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter by Start Date To */}
        <div>
          <label htmlFor="startDateTo" className="block text-sm font-medium text-gray-700">
            Start Date To
          </label>
          <input
            type="date"
            id="startDateTo"
            value={filterStartDateTo}
            onChange={(e) => setFilterStartDateTo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter by Due Date From */}
        <div>
          <label htmlFor="dueDateFrom" className="block text-sm font-medium text-gray-700">
            Due Date From
          </label>
          <input
            type="date"
            id="dueDateFrom"
            value={filterDueDateFrom}
            onChange={(e) => setFilterDueDateFrom(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter by Due Date To */}
        <div>
          <label htmlFor="dueDateTo" className="block text-sm font-medium text-gray-700">
            Due Date To
          </label>
          <input
            type="date"
            id="dueDateTo"
            value={filterDueDateTo}
            onChange={(e) => setFilterDueDateTo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Reset Filters Button */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default GanttFilters;
