import React, { useState } from 'react';
import Button from '../common/Button/Button';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import { IShiftType, ShiftTypeName } from '../../types/shift';

interface EditShiftTypeFormProps {
  shiftType: IShiftType;
  onSubmit: (id: string, updates: Partial<IShiftType>) => void;
  onCancel: () => void;
}

const EditShiftTypeForm: React.FC<EditShiftTypeFormProps> = ({ shiftType, onSubmit, onCancel }) => {
  console.log('EditShiftTypeForm', shiftType); // Debugging log

  const [name, setName] = useState<ShiftTypeName | null>(shiftType.name as ShiftTypeName);
  const [description, setDescription] = useState(shiftType.description || '');

  const shiftTypeOptions = Object.values(ShiftTypeName).map((type) => ({
    value: type,
    label: type,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<IShiftType> = {
      description,
      ...(name && name !== shiftType.name ? { name } : {}),
    };
    onSubmit(shiftType._id, updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SingleSelect
        label="Shift Type Name"
        options={shiftTypeOptions}
        value={name as string}
        onChange={(selectedValue) => setName(selectedValue as ShiftTypeName)}
        placeholder="Select Shift Type"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditShiftTypeForm;
