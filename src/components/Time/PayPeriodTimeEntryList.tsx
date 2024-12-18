import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable/DataTable';
import FilterByPayPeriodDropdown from './FilterByPayPeriodDropdown';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import EditTimeEntryModal from './EditTimeEntryModal';
import Pagination from '../common/Pagination/Pagination';
import {
  useFetchTimeEntriesByPayPeriodQuery,
  useDeleteTimeEntryMutation,
  useAdminUpdateTimeEntryMutation,
} from '../../api/timeEntryApiSlice';
import { ITimeEntry } from '../../types/timeEntry';
import LoadingSpinner from '../Loader';

const PayPeriodTimeEntryList: React.FC = () => {
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [editingEntry, setEditingEntry] = useState<ITimeEntry | null>(null);

  const { data, isLoading } = useFetchTimeEntriesByPayPeriodQuery(
    {
      payPeriodId: selectedPayPeriod || '',
      page: currentPage,
      limit: itemsPerPage,
    },
    { skip: !selectedPayPeriod }
  );

  const [deleteTimeEntry] = useDeleteTimeEntryMutation();
  const [updateTimeEntry] = useAdminUpdateTimeEntryMutation();

  const handleDelete = async () => {
    if (deleteConfirmation.id) {
      await deleteTimeEntry(deleteConfirmation.id);
      setDeleteConfirmation({ isOpen: false, id: null });
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
        typeof entry.employee === 'object' && entry.employee.name ? entry.employee.name : 'Unknown',
    },
    {
      header: 'Shift',
      accessor: (entry) =>
        typeof entry.shift === 'object' && entry.shift.shiftType
          ? entry.shift.shiftType.name
          : 'Unknown Shift',
    },
    { header: 'Clock In', accessor: (entry) => new Date(entry.clockIn).toLocaleString() },
    { header: 'Clock Out', accessor: (entry) => (entry.clockOut ? new Date(entry.clockOut).toLocaleString() : '-') },
    { header: 'Hours Worked', accessor: (entry) => entry.hoursWorked.toFixed(2) },
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
            onClick={() => setDeleteConfirmation({ isOpen: true, id: entry._id })}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow m-6">
      <h2 className="text-2xl border p-2 text-center font-bold mb-4 font-primary bg-gradient-to-t
           from-teal-600 via-cyan-900 to-gray-900 text-white">
        Pay Period Time Entries
      </h2>
  
      <FilterByPayPeriodDropdown onChange={(payPeriod) => setSelectedPayPeriod(payPeriod?._id || null)} />
  
      {isLoading ? (
        <LoadingSpinner />
      ) : data && data.data.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full shadow-md rounded-lg bg-white dark:bg-gray-800">
            <DataTable columns={columns} data={data.data} />
            <div className="flex justify-between items-center mt-4 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No time entries found for the selected pay period.</p>
      )}
  
      {/* Edit Time Entry Modal */}
      {editingEntry && (
        <EditTimeEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          timeEntry={editingEntry}
          onSave={handleEditSave}
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

export default PayPeriodTimeEntryList;
