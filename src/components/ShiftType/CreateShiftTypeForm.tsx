// src/components/ShiftType/CreateShiftTypeForm.tsx

import React, { useState } from 'react';
import Button from '../common/Button/Button';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import { ShiftTypeName } from '../../types/shift';

interface CreateShiftTypeFormProps {
  onSubmit: (name: ShiftTypeName, description?: string) => void;
  onCancel: () => void;
}

const CreateShiftTypeForm: React.FC<CreateShiftTypeFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState<string | null>(null); // Use string | null to match SingleSelect
  const [description, setDescription] = useState('');

  // Transform ShiftTypeName enum into options for SingleSelect
  const shiftTypeOptions = Object.values(ShiftTypeName).map((type) => ({
    value: type,
    label: type,
  }));

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && Object.values(ShiftTypeName).includes(name as ShiftTypeName)) {
      onSubmit(name as ShiftTypeName, description); // Cast back to ShiftTypeName
    } else {
      console.error('Invalid shift type selected');
    }
  };

  return (
    <div className="space-y-4 dark:text-gray-50">
    <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-50">
      <SingleSelect
        label="Shift Type Name"
        options={shiftTypeOptions}
        value={name}
        onChange={setName}
        placeholder="Select Shift Type"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
          placeholder="Optional description"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create
        </Button>
      </div>
    </form>
    </div>
  );
};

export default CreateShiftTypeForm;
