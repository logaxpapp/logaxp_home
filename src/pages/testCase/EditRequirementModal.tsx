import React, { useState } from 'react';
import { IRequirement, APPLICATIONS } from '../../types/requirement';
import { FaPlug, FaAdjust } from 'react-icons/fa';

interface EditRequirementModalProps {
  requirement: IRequirement;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<IRequirement>) => void;
}

export const EditRequirementModal: React.FC<EditRequirementModalProps> = ({
  requirement,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(requirement.title);
  const [description, setDescription] = useState(requirement.description || '');
  const [priority, setPriority] = useState(requirement.priority || 'Medium');
  const [status, setStatus] = useState(requirement.status || 'Open');
  const [application, setApplication] = useState(requirement.application);
  const [errors, setErrors] = useState<{ title?: string; application?: string }>({});

  const handleSubmit = () => {
    const newErrors: { title?: string; application?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!application) {
      newErrors.application = 'Application is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onUpdate(requirement._id, {
      title,
      description,
      priority,
      status,
      application,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Requirement</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaAdjust className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.application ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          >
            <option value="">-- Select Application --</option>
            {APPLICATIONS.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>
          {errors.application && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaPlug className="h-4 w-4 mr-1" />
              {errors.application}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaPlug className="h-4 w-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};