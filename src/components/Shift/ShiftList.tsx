// src/components/ShiftList/ShiftList.tsx

import React, { useState, useMemo } from 'react';
import {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useCreateMultipleShiftsMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useAssignShiftMutation,
} from '../../api/shiftApi';
import { IShift } from '../../types/shift';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Button from '../common/Button/Button';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import Modal from '../common/Feedback/Modal';
import CreateShiftForm from './CreateShiftForm';
import CreateMultipleShiftsForm from './CreateMultipleShiftsForm';
import EditShiftForm from './EditShiftForm';
import AssignShiftForm from './AssignShiftForm';
import ActionsDropdown from '../common/ActionsDropdown';
import Pagination from '../common/Pagination/Pagination';
import { useToast } from '../../features/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const ShiftList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; // Number of shifts per page

  const { data, error, isLoading, refetch } = useGetShiftsQuery({
    page: currentPage,
    limit: pageSize,
  });

  const [createShift] = useCreateShiftMutation();
  const [createMultipleShifts] = useCreateMultipleShiftsMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [assignShift] = useAssignShiftMutation();

  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isCreateMultipleModalOpen, setCreateMultipleModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentShift, setCurrentShift] = useState<IShift | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [shiftToDelete, setShiftToDelete] = useState<IShift | null>(null);
  const [isAssignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [shiftToAssign, setShiftToAssign] = useState<IShift | null>(null);

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const { showToast } = useToast();
  const navigate = useNavigate();

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const columns: Column<IShift>[] = useMemo(
    () => [
      {
        header: 'Shift Type',
        accessor: 'shiftType' as keyof IShift,
        sortable: true,
        Cell: ({ value }) => value?.name || 'N/A',
      },
      {
        header: 'Date',
        accessor: 'date' as keyof IShift,
        sortable: true,
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : 'Invalid Date',
      },
      {
        header: 'Start Time',
        accessor: 'startTime' as keyof IShift,
        sortable: true,
      },
      {
        header: 'End Time',
        accessor: 'endTime' as keyof IShift,
        sortable: true,
      },
      {
        header: 'Status',
        accessor: 'status' as keyof IShift,
        sortable: true,
      },
      {
        header: 'Assigned To',
        accessor: 'assignedTo' as keyof IShift,
        sortable: true,
        Cell: ({ value }) => value?.name || 'Unassigned',
      },
      {
        header: 'Actions',
        accessor: '_id' as keyof IShift,
        sortable: false,
        Cell: ({ value }) => {
          const shift = data?.shifts.find((s) => s._id === value);
          return shift ? (
            <ActionsDropdown
              onEdit={() => {
                setCurrentShift(shift);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setShiftToDelete(shift);
                setDeleteModalOpen(true);
              }}
              onAssign={() => {
                setShiftToAssign(shift);
                setAssignModalOpen(true);
              }}
            />
          ) : <span>N/A</span>;
        },
      },
    ],
    [data?.shifts]
  );

  const filteredShifts = useMemo<IShift[]>(() => {
    if (!data?.shifts) return [];
    return data.shifts.filter(
      (shift) =>
        (shift.shiftType?.name &&
          shift.shiftType.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (shift.assignedTo?.name &&
          shift.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data?.shifts, searchTerm]);

  // Function to export selected shifts as CSV
  const exportSelectedShifts = () => {
    if (selectedRowIds.size === 0) {
      showToast('No shifts selected for export.', 'error');
      return;
    }

    const headers = ['Shift Type', 'Date', 'Start Time', 'End Time', 'Status', 'Assigned To'];
    const rows = Array.from(selectedRowIds).map(shiftId => {
      const shift = data?.shifts.find(shift => shift._id === shiftId);
      if (!shift) return ['-', '-', '-', '-', '-', '-'];
      return [
        shift.shiftType?.name || 'N/A',
        shift.date ? new Date(shift.date).toLocaleDateString() : 'Invalid Date',
        shift.startTime || '-',
        shift.endTime || '-',
        shift.status || '-',
        shift.assignedTo?.name || 'Unassigned',
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_shifts_export.csv');
    link.click();
  };

  const handleCreate = async (shiftData: Partial<IShift>) => {
    try {
      await createShift(shiftData).unwrap();
      setCreateModalOpen(false);
      refetch();
      showToast('Shift created successfully.', 'success');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to create shift.', 'error');
    }
  };

  const handleCreateMultiple = async (shiftData: any) => {
    try {
      await createMultipleShifts(shiftData).unwrap();
      setCreateMultipleModalOpen(false);
      refetch();
      showToast('Multiple shifts created successfully.', 'success');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to create multiple shifts.', 'error');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<IShift>) => {
    try {
      await updateShift({ id, updates }).unwrap();
      setEditModalOpen(false);
      setCurrentShift(null);
      refetch();
      showToast('Shift updated successfully.', 'success');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to update shift.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShift(id).unwrap();
      setDeleteModalOpen(false);
      setShiftToDelete(null);
      refetch();
      showToast('Shift deleted successfully.', 'success');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to delete shift.', 'error');
    }
  };

  const handleAssign = async (shiftId: string, userId: string) => {
    try {
      await assignShift({ shiftId, userId }).unwrap();
      setAssignModalOpen(false);
      setShiftToAssign(null);
      refetch();
      showToast('Shift assigned successfully.', 'success');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to assign shift.', 'error');
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 bg-white p-4 rounded-lg shadow-sm gap-4">
  {/* Search Input */}
  <div className="flex-1">
    <input
      type="text"
      placeholder="Search shifts..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap justify-end gap-2">
    <Button
      variant="primary"
      onClick={() => setCreateModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
    >
      <FaPlus className="text-white" /> Create
    </Button>

    <Button
      variant="success"
      onClick={() => setCreateMultipleModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition"
    >
      <FaPlus className="text-white" /> Bulk Create
    </Button>

    <Button
      variant="secondary"
      onClick={exportSelectedShifts}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
    >
      Export
    </Button>
  </div>
</div>


      {/* DataTable */}
      <DataTable<IShift>
        data={filteredShifts}
        columns={columns}
        selectable
        selectedRowIds={selectedRowIds}
        onRowSelect={setSelectedRowIds}
        onRowClick={(shift) => {
          setCurrentShift(shift);
          setEditModalOpen(true);
        }}
        sortColumn={undefined} // Implement sorting state if needed
        sortDirection={undefined}
        onSort={undefined}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Create Shift Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create Shift"
        >
          <CreateShiftForm
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
          />
        </Modal>
      )}

      {/* Create Multiple Shifts Modal */}
      {isCreateMultipleModalOpen && (
        <Modal
          isOpen={isCreateMultipleModalOpen}
          onClose={() => setCreateMultipleModalOpen(false)}
          title="Create Multiple Shifts"
        >
          <CreateMultipleShiftsForm
            onSubmit={handleCreateMultiple}
            onCancel={() => setCreateMultipleModalOpen(false)}
          />
        </Modal>
      )}

      {/* Edit Shift Modal */}
      {isEditModalOpen && currentShift && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Shift"
        >
          <EditShiftForm
            shift={currentShift}
            onSubmit={(updates) => handleUpdate(currentShift._id, updates)}
            onCancel={() => setEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Assign Shift Modal */}
      {isAssignModalOpen && shiftToAssign && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Assign Shift"
        >
          <AssignShiftForm
            shift={shiftToAssign}
            onSubmit={(userId) => handleAssign(shiftToAssign._id, userId)}
            onCancel={() => setAssignModalOpen(false)}
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && shiftToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDelete(shiftToDelete._id)}
          title="Confirm Delete"
          message={`Are you sure you want to delete the shift on "${new Date(
            shiftToDelete.date
          ).toLocaleDateString()}"?`}
        />
      )}
    </div>
  );
};

export default ShiftList;
