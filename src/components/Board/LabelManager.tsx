// src/components/Label/LabelManager.tsx

import React, { useState } from 'react';
import {
  useGetLabelsByBoardQuery,
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useUpdateLabelMutation,
} from '../../api/tasksApi';
import { ILabel, CreateLabelInput, UpdateLabelInput } from '../../types/task';
import { useToast } from '../../features/Toast/ToastContext';
import { FiTrash2, FiEdit } from 'react-icons/fi';

interface LabelManagerProps {
  boardId: string;
}

const LabelManager: React.FC<LabelManagerProps> = ({ boardId }) => {
  // Fetch labels for this board
  const {
    data: labels,
    isLoading: labelsLoading,
    isError: labelsError,
  } = useGetLabelsByBoardQuery(boardId);

  console.log('Board ID:', boardId);

  const { showToast } = useToast(); // Use the typed showToast function

  const [createLabel] = useCreateLabelMutation();
  const [deleteLabel] = useDeleteLabelMutation();
  const [updateLabel] = useUpdateLabelMutation(); // Initialize the update mutation

  // Form state for creating a new label
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#ffffff');

  // State for editing a label
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState('');
  const [editingLabelColor, setEditingLabelColor] = useState('#ffffff');

  // Create Label Handler
  const handleCreateLabel = async () => {
    if (!labelName.trim()) {
      alert('Label name cannot be empty.');
      return;
    }

    const newLabel: CreateLabelInput = {
      name: labelName,
      color: labelColor,
      boardId: boardId,
    };

    try {
      await createLabel(newLabel).unwrap();

      setLabelName('');
      setLabelColor('#ffffff');
      showToast('Label created successfully!');
    } catch (error) {
      console.error('Create label error:', error);
      showToast('Failed to create label.');
    }
  };

  // Delete Label Handler
  const handleDeleteLabel = async (labelId: string) => {
    if (!window.confirm('Are you sure you want to delete this label?')) return;
    try {
      await deleteLabel(labelId).unwrap();
      showToast('Label deleted successfully!');
    } catch (error) {
      console.error('Delete label error:', error);
      showToast('Failed to delete label.');
    }
  };

  // Edit Label Handler
  const handleEditLabel = (label: ILabel) => {
    setEditingLabelId(label._id);
    setEditingLabelName(label.name);
    setEditingLabelColor(label.color);
  };

  // Update Label Handler
  const handleUpdateLabel = async () => {
    if (!editingLabelId) return;
    if (!editingLabelName.trim()) {
      showToast('Label name cannot be empty.');
      return;
    }
  
    const updatedLabel: UpdateLabelInput = {
      _id: editingLabelId, // Use _id
      name: editingLabelName,
      color: editingLabelColor,
    };
  
    try {
      await updateLabel(updatedLabel).unwrap();
  
      setEditingLabelId(null);
      setEditingLabelName('');
      setEditingLabelColor('#ffffff');
      showToast('Label updated successfully!');
    } catch (error: any) {
      console.error('Update label error:', error);
      // Display backend error message if available
      if (error.data && error.data.message) {
        showToast(error.data.message);
      } else {
        showToast('Failed to update label.');
      }
    }
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditingLabelId(null);
    setEditingLabelName('');
    setEditingLabelColor('#ffffff');
  };

  // Render states
  if (labelsLoading) return <p>Loading labels...</p>;
  if (labelsError) return <p className="text-red-600">Error loading labels</p>;

  return (
    <div className="p-6 bg-gray-100 text-gray-800 rounded shadow-md space-y-6 sidebar">
      {/* Form to create a new label */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-md font-semibold text-gray-700 mb-3">Create a New Label</h2>
        <div className="flex flex-col md:flex-row items-center md:items-end gap-3">
          <div className="flex-1">
            <label htmlFor="labelName" className="block text-sm font-medium text-gray-700">
              Label Name
            </label>
            <input
              id="labelName"
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
              placeholder="e.g., Bug, Feature, etc."
            />
          </div>

          <div>
            <label htmlFor="labelColor" className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              id="labelColor"
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded-md p-1 cursor-pointer"
            />
          </div>

          <button
            onClick={handleCreateLabel}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Create Label
          </button>
        </div>
      </div>

      {/* Labels List */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-md font-semibold text-gray-700 mb-3">Existing Labels</h2>
        {labels && labels.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Name</th>
                <th className="border-b p-2 text-left">Color</th>
                <th className="border-b p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label: ILabel) => (
                <tr key={label._id}>
                  <td className="border-b p-2">
                    {editingLabelId === label._id ? (
                      <input
                        type="text"
                        value={editingLabelName}
                        onChange={(e) => setEditingLabelName(e.target.value)}
                        className="border border-gray-300 rounded-md p-1"
                      />
                    ) : (
                      label.name
                    )}
                  </td>
                  <td className="border-b p-2 flex items-center">
                    {editingLabelId === label._id ? (
                      <input
                        type="color"
                        value={editingLabelColor}
                        onChange={(e) => setEditingLabelColor(e.target.value)}
                        className="h-6 w-6 border border-gray-300 rounded-md p-0.5 cursor-pointer"
                      />
                    ) : (
                      <>
                        <span
                          className="inline-block w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.color}
                      </>
                    )}
                  </td>
                  <td className="border-b p-2">
                    {editingLabelId === label._id ? (
                      <>
                        <button
                          onClick={handleUpdateLabel}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="flex">
                        <button
                          onClick={() => handleEditLabel(label)}
                          className="text-blue-600 hover:text-blue-800 mr-2 flex items-center"
                        >
                          <FiEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLabel(label._id)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No labels found for this board.</p>
        )}
      </div>
    </div>
  );
};

export default LabelManager;
