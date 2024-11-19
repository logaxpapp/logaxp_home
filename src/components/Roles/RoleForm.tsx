import React, { useState } from 'react';
import { IRole } from '../../types/role';
import { IPermission } from '../../types/permission';
import TextInput from '../common/Input/TextInput';
import Button from '../common/Button/Button';
import { useGetPermissionsQuery } from '../../api/permissionApi';

interface RoleFormProps {
  role: IRole | null;
  onSubmit: (roleData: Partial<IRole>) => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSubmit, onCancel }) => {
  const { data: allPermissions, isLoading } = useGetPermissionsQuery();
  const [name, setName] = useState(role?.name || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions.map((perm) => perm._id) || []
  );

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permissionId)
        ? prevPermissions.filter((id) => id !== permissionId)
        : [...prevPermissions, permissionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map selectedPermissions (IDs) back to IPermission objects
    const mappedPermissions: IPermission[] = allPermissions?.filter((permission) =>
      selectedPermissions.includes(permission._id)
    ) || [];

    onSubmit({ name, permissions: mappedPermissions });
  };

  if (isLoading) return <div>Loading permissions...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Role Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">
          Permissions
        </label>
        <div>
          {allPermissions?.map((permission) => (
            <label key={permission._id} className="mr-4 mb-2 flex items-center">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission._id)}
                onChange={() => handlePermissionChange(permission._id)}
                className="form-checkbox"
              />
              <span className="ml-2">{formatPermissionLabel(permission.name)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="ml-2">
          {role ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

const formatPermissionLabel = (permName: string): string => {
  return permName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default RoleForm;
