import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import FilterByShiftDropdown from './FilterByShiftDropdown';
import EditTimeEntryModal from './EditTimeEntryModal';
import { useFetchTimeEntriesByShiftQuery, useDeleteTimeEntryMutation, useAdminUpdateTimeEntryMutation } from '../../api/timeEntryApiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react'; // Import skipToken
import { ITimeEntry } from '../../types/timeEntry';
import LoadingSpinner from '../Loader';

const ShiftTimeEntryList: React.FC = () => {
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<ITimeEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Default page size

  // Use skipToken when no shift is selected
  const { data: timeEntriesResponse, isLoading } = useFetchTimeEntriesByShiftQuery(
    selectedShift ? { shiftId: selectedShift, page: currentPage, limit } : skipToken
  );

  const [deleteTimeEntry] = useDeleteTimeEntryMutation();
  const [updateTimeEntry] = useAdminUpdateTimeEntryMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      await deleteTimeEntry(id);
    }
  };

  const handleEditSave = async (updates: any) => {
    if (editingEntry) {
      await updateTimeEntry({ id: editingEntry._id, updates });
      setEditingEntry(null);
    }
  };

  const columns: Column<ITimeEntry>[] = [
    {
      header: 'Employee',
      accessor: (entry) =>
        typeof entry.employee === 'object' && entry.employee !== null
          ? entry.employee.name
          : 'Unknown Employee',
    },
    {
      header: 'Clock In',
      accessor: (entry) => (entry.clockIn ? new Date(entry.clockIn).toLocaleString() : '-'),
    },
    {
      header: 'Clock Out',
      accessor: (entry) => (entry.clockOut ? new Date(entry.clockOut).toLocaleString() : '-'),
    },
    {
      header: 'Hours Worked',
      accessor: (entry) => entry.hoursWorked.toFixed(2),
    },
    {
      header: 'Actions',
      accessor: (entry) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setEditingEntry(entry)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(entry._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const { data: timeEntries = [], pagination } = timeEntriesResponse || {};

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl border p-2 text-center font-bold mb-4 font-primary bg-yellow-100">Shift Time Entries</h2>
  
      <FilterByShiftDropdown onChange={(shift) => setSelectedShift(shift?._id || null)} />
  
      {isLoading ? (
        <LoadingSpinner />
      ) : timeEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full shadow-md rounded-lg bg-white dark:bg-gray-800">
            <DataTable columns={columns} data={timeEntries} />
            {pagination && (
              <div className="flex justify-between items-center mt-4 px-4">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No time entries found for the selected shift.</p>
      )}
  
      {editingEntry && (
        <EditTimeEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          timeEntry={editingEntry}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
  
};

export default ShiftTimeEntryList;
