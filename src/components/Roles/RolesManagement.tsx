import React, { useState, useMemo } from 'react';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../../api/roleApi';
import { IRole } from '../../types/role';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import RoleForm from './RoleForm';
import DataTable, { Column } from '../common/DataTable/DataTable';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

const RolesManagement: React.FC = () => {
  const { data: roles, isLoading, error } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRolePermissions, setViewRolePermissions] = useState<IRole | null>(null);

  const handleCreateOrUpdateRole = async (roleData: Partial<IRole>) => {
    if (currentRole) {
      await updateRole({ id: currentRole._id, updates: roleData });
    } else {
      await createRole(roleData);
    }
    setIsModalOpen(false);
    setCurrentRole(null);
  };

  const handleEditRole = (role: IRole) => {
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      await deleteRole(id);
    }
  };

  const handleViewPermissions = (role: IRole) => {
    setViewRolePermissions(role);
    setIsViewModalOpen(true);
  };

  // Filter roles based on search term
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(lowercasedSearchTerm) ||
        role.permissions.some((perm) =>
          perm.name.toLowerCase().includes(lowercasedSearchTerm)
        )
    );
  }, [roles, searchTerm]);

  // Define columns for DataTable
  const columns: Column<IRole>[] = [
    {
      header: 'Role Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Permissions',
      accessor: (role) => (
        <div>
          {role.permissions.slice(0, 3).map((perm) => (
            <span
              key={perm._id}
              className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1"
            >
              {formatPermissionLabel(perm.name)}
            </span>
          ))}
          {role.permissions.length > 3 && (
            <span className="text-xs text-gray-500">
              +{role.permissions.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (role) => (
        <DropdownMenu
          options={[
            {
              label: 'View',
              onClick: () => handleViewPermissions(role),
            },
            {
              label: 'Edit',
              onClick: () => handleEditRole(role),
            },
            {
              label: 'Delete',
              onClick: () => handleDeleteRole(role._id),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <div>Loading roles...</div>;
  if (error) return <div>Error loading roles</div>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold font-primary text-blue-700">Roles Management</h3>
        <Button onClick={() => setIsModalOpen(true)}>Create Role</Button>
      </div>
      <input
        type="text"
        placeholder="Search roles or permissions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="mb-20">
        <DataTable data={filteredRoles} columns={columns} />
      </div>
      {/* Role Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentRole(null);
          }}
          title={currentRole ? 'Edit Role' : 'Create Role'}
        >
          <RoleForm
            role={currentRole}
            onSubmit={handleCreateOrUpdateRole}
            onCancel={() => {
              setIsModalOpen(false);
              setCurrentRole(null);
            }}
          />
        </Modal>
      )}

      {/* View Permissions Modal */}
      {isViewModalOpen && viewRolePermissions && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewRolePermissions(null);
          }}
          title={`Permissions for ${viewRolePermissions.name}`}
        >
          <div className="p-4 max-h-96 overflow-y-auto">
            {viewRolePermissions.permissions.length > 0 ? (
              viewRolePermissions.permissions.map((perm) => (
                <div
                  key={perm._id}
                  className="mb-4 p-4 border rounded-lg shadow-sm bg-white"
                >
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      {formatPermissionLabel(perm.name)}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {perm.description || 'No description provided'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">This role has no permissions assigned.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

const formatPermissionLabel = (permName?: string): string => {
  if (!permName) return 'Unnamed Permission';
  return permName
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default RolesManagement;
