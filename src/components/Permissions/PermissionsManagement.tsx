import React, { useState, useMemo } from 'react';
import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from '../../api/permissionApi';
import { IPermission } from '../../types/permission';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Button from '../common/Button/Button';
import Modal from '../common/Feedback/Modal';
import PermissionForm from './PermissionForm';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

const PermissionsManagement: React.FC = () => {
  const { data: permissions, isLoading, error } = useGetPermissionsQuery();
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<IPermission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateOrUpdatePermission = async (permissionData: Partial<IPermission>) => {
    if (currentPermission) {
      await updatePermission({ id: currentPermission._id, updates: permissionData });
    } else {
      await createPermission(permissionData);
    }
    setIsModalOpen(false);
    setCurrentPermission(null);
  };

  const handleEditPermission = (permission: IPermission) => {
    setCurrentPermission(permission);
    setIsModalOpen(true);
  };

  const handleDeletePermission = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      await deletePermission(id);
    }
  };

  // Filter permissions based on search term
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(lowercasedSearchTerm) ||
        (permission.description &&
          permission.description.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [permissions, searchTerm]);

  const columns: Column<IPermission>[] = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
    },
    {
      header: 'Actions',
      accessor: (permission) => (
        <DropdownMenu
          options={[
            {
              label: 'Edit',
              onClick: () => handleEditPermission(permission),
            },
            {
              label: 'Delete',
              onClick: () => handleDeletePermission(permission._id),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions</div>;

  return (
    <div className="bg-blue-50 p-8 mb-4">
      <div className="flex justify-between items-center mb-4  bg-gray-50 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold font-primary text-blue-700">Permissions Management</h3>
        <Button onClick={() => setIsModalOpen(true)}>Create Permission</Button>
      </div>
      <input
        type="text"
        placeholder="Search permissions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <DataTable data={filteredPermissions} columns={columns} />

      {/* Permission Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentPermission(null);
          }}
          title={currentPermission ? 'Edit Permission' : 'Create Permission'}
        >
          <PermissionForm
            permission={currentPermission}
            onSubmit={handleCreateOrUpdatePermission}
            onCancel={() => {
              setIsModalOpen(false);
              setCurrentPermission(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default PermissionsManagement;
