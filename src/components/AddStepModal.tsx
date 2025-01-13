// src/components/AddStepDialog.tsx

import React from 'react';
import { useFetchAllUsersQuery } from '../api/usersApi';
import { IUser } from '../types/user';
import SingleSelect, { OptionType } from './common/Input/SelectDropdown/SingleSelect';

interface AddStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newApproverId: string, stepName: string, comment: string) => void;
}

const AddStepDialog: React.FC<AddStepDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newApproverId, setNewApproverId] = React.useState<string | null>(null);
  const [stepName, setStepName] = React.useState('');
  const [comment, setComment] = React.useState(''); // New state for comment
  const [errors, setErrors] = React.useState<{ newApproverId?: string; stepName?: string }>({});

  // Fetch approvers (assuming 'Approver' is the role)
  const { data, error: approversError, isLoading: isApproversLoading } = useFetchAllUsersQuery({ page: 1, limit: 10 });

  // Transform approvers to OptionType
  const approverOptions: OptionType[] = data?.users.map((user: IUser) => ({
    value: user._id,
    label: `${user.name} (${user.email})`, // Display name and email for clarity
  })) || [];

  // Handle form submission
  const handleSubmit = () => {
    const validationErrors: { newApproverId?: string; stepName?: string } = {};
    if (!newApproverId) {
      validationErrors.newApproverId = 'Approver is required.';
    }
    if (!stepName.trim()) {
      validationErrors.stepName = 'Step name is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(newApproverId!, stepName.trim(), comment.trim()); // Pass comment to handler
    setNewApproverId(null);
    setStepName('');
    setComment(''); // Reset comment
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Approval Step</h2>
        </div>
        <div className="p-6">
          {/* Next Approver Selection */}
          <div className="mb-4">
            <SingleSelect
              label="Next Approver"
              options={approverOptions}
              value={newApproverId}
              onChange={(value) => setNewApproverId(value)}
              placeholder={isApproversLoading ? 'Loading approvers...' : 'Select Approver'}
              isDisabled={isApproversLoading || !!approversError}
            />
            {errors.newApproverId && (
              <p className="text-red-500 text-sm mt-1">{errors.newApproverId}</p>
            )}
         
          </div>

          {/* Step Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Step Name</label>
            <input
              type="text"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.stepName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen-light`}
              placeholder="Enter step name"
            />
            {errors.stepName && (
              <p className="text-red-500 text-sm mt-1">{errors.stepName}</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen-light resize-none h-24"
              placeholder="Add a comment (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={isApproversLoading || !!approversError}
            >
              Add Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStepDialog;
