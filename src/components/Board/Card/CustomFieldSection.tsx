// src/components/Card/CustomFieldSection.tsx
import React, { useState } from 'react';
import { ICard } from '../../../types/task';
import {
  useAddCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
} from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface CustomFieldSectionProps {
  card: ICard;
}

const CustomFieldSection: React.FC<CustomFieldSectionProps> = ({ card }) => {
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');

  const { showToast } = useToast();
  const [addCF] = useAddCustomFieldMutation();
  const [updateCF] = useUpdateCustomFieldMutation();
  const [deleteCF] = useDeleteCustomFieldMutation();

  const handleAddCustomField = async () => {
    if (!keyInput.trim()) {
      showToast('Field key cannot be empty.');
      return;
    }
    try {
      await addCF({
        cardId: card._id,
        customField: { key: keyInput, value: valueInput },
      }).unwrap();
      setKeyInput('');
      setValueInput('');
    } catch (error) {
      console.error('Add custom field error:', error);
      showToast('Failed to add custom field.');
    }
  };

  const startEdit = (index: number, currentKey: string, currentValue: string) => {
    setEditIndex(index);
    setEditKey(currentKey);
    setEditValue(currentValue);
  };

  const handleUpdateCustomField = async () => {
    if (editIndex === null) return;
    try {
      await updateCF({
        cardId: card._id,
        fieldIndex: editIndex,
        updates: { key: editKey, value: editValue },
      }).unwrap();
      showToast('Custom field updated!');
      setEditIndex(null);
      setEditKey('');
      setEditValue('');
    } catch (error) {
      console.error('Update custom field error:', error);
      showToast('Failed to update custom field.');
    }
  };

  const handleDeleteCustomField = async (index: number) => {
    if (!window.confirm('Delete this custom field?')) return;
    try {
      await deleteCF({ cardId: card._id, fieldIndex: index }).unwrap();
    } catch (error) {
      console.error('Delete custom field error:', error);
      showToast('Failed to delete custom field.');
    }
  };

  return (
    <div className="p-2">
      <h3 className="text-md font-semibold mb-2">Custom Fields</h3>

      {/* Add new custom field */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Field key"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Field value"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddCustomField}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
        >
          <FiPlus />
          Add
        </button>
      </div>

      {/* List of existing custom fields */}
      <ul className="space-y-2">
        {card.customFields?.map((cf, index) => (
          <li key={index} className="p-2 border rounded flex items-center justify-between">
            {editIndex === index ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  className="p-1 border rounded flex-1"
                />
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="p-1 border rounded flex-1"
                />
              </div>
            ) : (
              <div className="flex-1">
                <strong>{cf.key}</strong>: {cf.value}
              </div>
            )}

            <div className="ml-2 flex items-center gap-2">
              {editIndex === index ? (
                <button
                  onClick={handleUpdateCustomField}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiEdit />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(index, cf.key, cf.value)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiEdit />
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDeleteCustomField(index)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomFieldSection;
