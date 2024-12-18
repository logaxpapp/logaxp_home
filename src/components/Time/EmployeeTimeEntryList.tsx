import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import Button from '../common/Button/Button';
import IconButton from '../common/IconButton';
import FilterByEmployeeDropdown from './FilterByEmployeeDropdown';
import LoadingSpinner from '../Loader';
import CreateTimeEntryForm from './CreateTimeEntryForm';
import UpdateTimeEntryForm from './UpdateTimeEntryForm';
import { useFetchTimeEntriesByEmployeeQuery, useDeleteTimeEntryMutation } from '../../api/timeEntryApiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react'; // Import skipToken
import { ITimeEntry } from '../../types/timeEntry';
import { FaTrash, FaPen } from 'react-icons/fa';
import { IShift } from '../../types/shift';

const EmployeeTimeEntryList: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<ITimeEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Default limit per page

  const { data: timeEntriesResponse, isLoading, isError } = useFetchTimeEntriesByEmployeeQuery(
    selectedEmployee ? { employeeId: selectedEmployee, page: currentPage, limit } : skipToken
  );

  const [deleteTimeEntry, { isLoading: isDeleting }] = useDeleteTimeEntryMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        await deleteTimeEntry(id).unwrap();
      } catch (error) {
        console.error('Failed to delete time entry:', error);
      }
    }
  };

  const columns: Column<ITimeEntry>[] = [
    {
      header: 'Shift',
      accessor: (item) =>
        typeof item.shift === 'object' &&
        'shiftType' in item.shift &&
        typeof item.shift.shiftType === 'object' &&
        item.shift.shiftType.name
          ? item.shift.shiftType.name
          : '—',
    },
    {
      header: 'Clock In',
      accessor: (item) =>
        item.status === 'absent'
          ? `Absent: ${item.reasonForAbsence || 'No reason provided'}`
          : item.clockIn
          ? new Date(item.clockIn).toLocaleString()
          : '—',
    },
    {
      header: 'Clock Out',
      accessor: (item) =>
        item.status === 'absent'
          ? '—'
          : item.clockOut
          ? new Date(item.clockOut).toLocaleString()
          : '—',
    },
    {
      header: 'Hours Worked',
      accessor: 'hoursWorked',
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Actions',
      accessor: (item) => (
        <div className="flex space-x-2">
          <IconButton
            variant="primary"
            icon={<FaPen />}
            tooltip="Edit"
            ariaLabel="Edit Time Entry"
            onClick={() => setEditingEntry(item)}
          />
          <IconButton
            variant="danger"
            icon={<FaTrash />}
            tooltip="Delete"
            ariaLabel="Delete Time Entry"
            onClick={() => handleDelete(item._id)}
            disabled={isDeleting}
          />
        </div>
      ),
    },
  ];

  const { data: timeEntries = [], pagination } = timeEntriesResponse || {};

  return (
    <div className="p-6 bg-white rounded-lg shadow-md font-secondary">
      <h1 className="text-2xl border p-2 text-center font-bold mb-4 font-primary bg-gradient-to-t
           from-teal-600 via-cyan-900 to-gray-900 text-white">Employee Time Entries</h1>
  
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <FilterByEmployeeDropdown
          value={selectedEmployee ?? ''}
          onChange={(id) => setSelectedEmployee(id)}
          className="w-full md:w-1/3"
        />
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          Create Time Entry
        </Button>
      </div>
  
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center py-4">
          Failed to load time entries. Please try again later.
        </div>
      ) : timeEntries.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <DataTable data={timeEntries} columns={columns} />
          </div>
          {pagination && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-600 text-center py-4">
          No time entries found for the selected employee.
        </div>
      )}
  
      {/* Create Time Entry Modal */}
      {isCreating && <CreateTimeEntryForm onClose={() => setIsCreating(false)} />}
  
      {/* Update Time Entry Modal */}
      {editingEntry && (
        <UpdateTimeEntryForm
          timeEntry={editingEntry}
          employees={[
            { value: selectedEmployee ?? '', label: 'Selected Employee Name' },
          ]}
          shifts={(timeEntries ?? [])
            .filter((entry) => typeof entry.shift === 'object')
            .map((entry) => ({
              value: (entry.shift as IShift)._id,
              label: `${(entry.shift as IShift).startTime} - ${(entry.shift as IShift).endTime}`,
            }))}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
  
};

export default EmployeeTimeEntryList;
