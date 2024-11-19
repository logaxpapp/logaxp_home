import React, { useState } from 'react';
import {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useAssignShiftMutation,
  useCreateMultipleShiftsMutation,
} from '../../api/shiftApi';
import DataTable, { Column } from '../common/DataTable/DataTableFallBack';
import Button from '../common/Button/Button';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import Modal from '../common/Feedback/Modal';
import { IShift } from '../../types/shift';
import CreateShiftForm from './CreateShiftForm';
import CreateMultipleShiftsForm from './CreateMultipleShiftsForm';
import EditShiftForm from './EditShiftForm';
import AssignShiftForm from './AssignShiftForm';
import ActionsDropdown from '../common/ActionsDropdown';
import Pagination from '../common/Pagination/Pagination';

const ShiftList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, error, isLoading, refetch } = useGetShiftsQuery({
    page: currentPage,
    limit: pageSize,
  });

  const [createShift] = useCreateShiftMutation();
  const [createMultipleShifts] = useCreateMultipleShiftsMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [assignShift] = useAssignShiftMutation();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateMultipleModalOpen, setCreateMultipleModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<IShift | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<IShift | null>(null);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [shiftToAssign, setShiftToAssign] = useState<IShift | null>(null);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const columns: Column<IShift>[] = [
    {
      header: 'Shift Type',
      accessor: (shift) => shift.shiftType?.name || 'N/A',
      sortable: true,
    },
    {
      header: 'Date',
      accessor: (shift) =>
        shift.date ? new Date(shift.date).toLocaleDateString() : 'Invalid Date', // Convert date string to a formatted date
      sortable: true,
    },
    {
      header: 'Start Time',
      accessor: 'startTime',
    },
    {
      header: 'End Time',
      accessor: 'endTime',
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Assigned To',
      accessor: (shift) => shift.assignedTo?.name || 'Unassigned',
    },
    {
      header: 'Actions',
      accessor: (shift) => (
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
      ),
    },
  ];

  const handleCreate = async (shiftData: Partial<IShift>) => {
    await createShift(shiftData).unwrap();
    setCreateModalOpen(false);
    refetch();
  };

  const handleCreateMultiple = async (shiftData: any) => {
    await createMultipleShifts(shiftData).unwrap();
    setCreateMultipleModalOpen(false);
    refetch();
  };

  const handleUpdate = async (id: string, updates: Partial<IShift>) => {
    await updateShift({ id, updates }).unwrap();
    setEditModalOpen(false);
    setCurrentShift(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteShift(id).unwrap();
    setDeleteModalOpen(false);
    setShiftToDelete(null);
    refetch();
  };

  const handleAssign = async (shiftId: string, userId: string) => {
    await assignShift({ shiftId, userId }).unwrap();
    setAssignModalOpen(false);
    setShiftToAssign(null);
    refetch();
  };

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700 dark:text-gray-50">
      <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold font-primary text-gray-800 dark:text-lemonGreen-light">
          Shift Management
        </h3>
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            Create Shift
          </Button>
          <Button variant="success" onClick={() => setCreateMultipleModalOpen(true)}>
            Create Multiple Shifts
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-blue-600 font-semibold py-10">Loading shifts...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-10">Error loading shifts.</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <DataTable<IShift> data={data?.shifts || []} columns={columns} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Shift">
        <CreateShiftForm onSubmit={handleCreate} onCancel={() => setCreateModalOpen(false)} />
      </Modal>

      <Modal isOpen={isCreateMultipleModalOpen} onClose={() => setCreateMultipleModalOpen(false)} title="Create Multiple Shifts">
        <CreateMultipleShiftsForm onSubmit={handleCreateMultiple} onCancel={() => setCreateMultipleModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Shift">
        {currentShift && (
          <EditShiftForm
            shift={currentShift}
            onSubmit={handleUpdate}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Shift">
        {shiftToAssign && (
          <AssignShiftForm
            shift={shiftToAssign}
            onSubmit={handleAssign}
            onCancel={() => setAssignModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => shiftToDelete && handleDelete(shiftToDelete._id)}
        title="Confirm Delete"
        message={`Are you sure you want to delete the shift on "${shiftToDelete?.date}"?`}
      />
    </div>
  );
};

export default ShiftList;
