// src/components/ShiftType/ShiftTypeList.tsx

import React, { useState } from 'react';
import { useGetShiftTypesQuery, useCreateShiftTypeMutation, useUpdateShiftTypeMutation, useDeleteShiftTypeMutation } from '../../api/shiftApi';
import DataTable, { Column } from '../common/DataTable/DataTableFallBack';
import Button from '../common/Button/Button';
import ConfirmModal from '../common/Feedback/ConfirmModal';
import Modal from '../common/Feedback/Modal';
import { IShiftType, ShiftTypeName } from '../../types/shift';
import CreateShiftTypeForm from './CreateShiftTypeForm';
import EditShiftTypeForm from './EditShiftTypeForm';
import ActionsDropdown from '../common/ActionsDropdown';

const ShiftTypeList: React.FC = () => {
  const { data: shiftTypes, error, isLoading, refetch } = useGetShiftTypesQuery();
  console.log(shiftTypes);
  const [createShiftType] = useCreateShiftTypeMutation();
  const [updateShiftType] = useUpdateShiftTypeMutation();
  const [deleteShiftType] = useDeleteShiftTypeMutation();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentShiftType, setCurrentShiftType] = useState<IShiftType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shiftTypeToDelete, setShiftTypeToDelete] = useState<IShiftType | null>(null);

  const handleCreate = async (name: ShiftTypeName, description?: string) => {
    try {
      await createShiftType({ name, description }).unwrap();
      setCreateModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to create shift type:', err);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<IShiftType>) => {
    try {
      await updateShiftType({ id, updates }).unwrap();
      setEditModalOpen(false);
      setCurrentShiftType(null);
      refetch();
    } catch (err) {
      console.error('Failed to update shift type:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShiftType(id).unwrap();
      setDeleteModalOpen(false);
      setShiftTypeToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete shift type:', err);
    }
  };
  const columns: Column<IShiftType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: false,
      Cell: ({ value }: { value: IShiftType }) => (
        <span>{value.description || 'No description'}</span>
      ),
    },
    {
      header: '',
      accessor: 'actions', // Dummy accessor for custom cell content
      sortable: false,
      Cell: ({ value }: { value: IShiftType }) => (
        <ActionsDropdown
          onEdit={() => {
            setCurrentShiftType(value);
            setEditModalOpen(true);
          }}
          onDelete={() => {
            setShiftTypeToDelete(value);
            setDeleteModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700 dark:text-gray-50">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-600">
        <h2 className="text-3xl font-bold text-blue-800 font-primary dark:text-lemonGreen-light">Shift Types</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          Create Shift Type
        </Button>
      </div>

      {isLoading ? (
        <p>Loading shift types...</p>
      ) : error ? (
        <p className="text-red-500">Error loading shift types.</p>
      ) : (
        <DataTable<IShiftType>
          data={shiftTypes || []}
          columns={columns}
          onRowClick={undefined}
        />
      )}

      {/* Create Shift Type Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Shift Type"
      >
        <CreateShiftTypeForm
          onSubmit={handleCreate}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Shift Type Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Shift Type"
      >
        {currentShiftType && (
          <EditShiftTypeForm
            shiftType={currentShiftType}
            onSubmit={handleUpdate}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() =>
          shiftTypeToDelete && handleDelete(shiftTypeToDelete._id)
        }
        title="Confirm Delete"
        message={`Are you sure you want to delete the shift type "${shiftTypeToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ShiftTypeList;
