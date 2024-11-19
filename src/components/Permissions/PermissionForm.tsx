// src/components/UserManagement/Permissions/PermissionForm.tsx

import React, { useState } from 'react';
import { IPermission } from '../../types/permission';
import TextInput from '../common/Input/TextInput';
import Button from '../common/Button/Button';

interface PermissionFormProps {
  permission: IPermission | null;
  onSubmit: (permissionData: Partial<IPermission>) => void;
  onCancel: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ permission, onSubmit, onCancel }) => {
  const [name, setName] = useState(permission?.name || '');
  const [description, setDescription] = useState(permission?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Permission Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextInput
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="ml-2">
          {permission ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
