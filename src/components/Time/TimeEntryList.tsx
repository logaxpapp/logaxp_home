import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable/DataTableFallBack';
import Pagination from '../common/Pagination/Pagination';
import IconButton from '../common/IconButton';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import UpdateTimeEntryForm from './UpdateTimeEntryForm';
import { useFetchTimeEntriesByEmployeeQuery, useDeleteTimeEntryMutation, useUpdateTimeEntryMutation, useAdminUpdateTimeEntryMutation } from '../../api/timeEntryApiSlice';
import { useFetchEmployeesQuery } from '../../api/usersApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { ITimeEntry } from '../../types/timeEntry';
import { IUser } from '../../types/user';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TimeEntryList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [limit] = useState(10); // Default page size
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [editingEntry, setEditingEntry] = useState<ITimeEntry | null>(null);

  // Fetch employees for the dropdown
  const { data: employees, isLoading: isLoadingEmployees } = useFetchEmployeesQuery();

  // Fetch paginated time entries for the selected employee
  const { data: timeEntriesResponse, isLoading: isLoadingTimeEntries } =
    useFetchTimeEntriesByEmployeeQuery(
      selectedEmployee
        ? { employeeId: selectedEmployee, page: currentPage, limit }
        : skipToken
    );

  const [deleteTimeEntry, { isLoading: isDeleting }] = useDeleteTimeEntryMutation();
  const [updateTimeEntry] = useAdminUpdateTimeEntryMutation();

  const handleDelete = async () => {
    if (deleteConfirmation.id) {
      try {
        await deleteTimeEntry(deleteConfirmation.id).unwrap();
        setDeleteConfirmation({ isOpen: false, id: null });
      } catch (error) {
        console.error('Failed to delete time entry:', error);
      }
    }
  };


  const columns: Column<ITimeEntry>[] = [
    {
      header: 'Employee',
      accessor: (entry) =>
        typeof entry.employee === 'object' && entry.employee.name ? entry.employee.name : 'Unknown Employee',
    },
    {
      header: 'Shift',
      accessor: (entry) =>
        typeof entry.shift === 'object' && entry.shift.date
          ? new Date(entry.shift.date).toLocaleDateString()
          : 'Unknown Shift',
    },
    {
      header: 'Clock In',
      accessor: (entry) => (entry.clockIn ? new Date(entry.clockIn).toLocaleString() : 'N/A'),
    },
    {
      header: 'Clock Out',
      accessor: (entry) => (entry.clockOut ? new Date(entry.clockOut).toLocaleString() : '—'),
    },
    {
      header: 'Actions',
      accessor: (entry) => (
        <div className="flex space-x-2">
          <IconButton
            icon={<FaEdit />}
            tooltip="Edit Time Entry"
            variant="primary"
            ariaLabel="Edit Time Entry"
            onClick={() => setEditingEntry(entry)}
          />
          <IconButton
            icon={<FaTrash />}
            tooltip="Delete Time Entry"
            variant="danger"
            ariaLabel="Delete Time Entry"
            onClick={() => setDeleteConfirmation({ isOpen: true, id: entry._id })}
            disabled={isDeleting}
          />
        </div>
      ),
    },
  ];

  if (isLoadingEmployees) {
    return <div>Loading employees...</div>;
  }

  if (!employees || employees.length === 0) {
    return <div>No employees available.</div>;
  }

  const { data: timeEntries = [], pagination } = timeEntriesResponse || {};

  return (
    <div className="p-4">
      <h2 className="text-2xl border p-2 text-center font-bold mb-4 font-primary bg-yellow-100">Time Entries</h2>
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          value={selectedEmployee || ''}
          onChange={(e) => setSelectedEmployee(e.target.value || null)}
        >
          <option value="">Select Employee</option>
          {employees.map((employee: IUser) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      {isLoadingTimeEntries ? (
        <div>Loading time entries...</div>
      ) : timeEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full shadow-md rounded-lg bg-white dark:bg-gray-800">
            <DataTable data={timeEntries} columns={columns} />
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
        <p>No time entries found for the selected employee.</p>
      )}
  
      {/* Edit Time Entry Modal */}
      {editingEntry && (
        <UpdateTimeEntryForm
          timeEntry={editingEntry}
          onClose={() => setEditingEntry(null)}
          employees={employees.map((emp) => ({ value: emp._id, label: emp.name }))}
          shifts={timeEntries.map((entry) => {
            if (typeof entry.shift === 'object' && entry.shift !== null) {
              return {
                value: entry.shift._id,
                label: `${entry.shift.date ? new Date(entry.shift.date).toLocaleDateString() : 'Unknown Date'} (${
                  entry.shift.startTime
                } - ${entry.shift.endTime})`,
              };
            }
            return { value: '', label: 'Unknown Shift' };
          })}
        />
      )}
  
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Time Entry"
        message="Are you sure you want to delete this time entry? This action cannot be undone."
      />
    </div>
  );
  
};

export default TimeEntryList;
