import React, { useState, useEffect, FormEvent } from 'react';
import { ISupportTicket, ISupportTicketInput } from '../../types/support';
import { useUpdateTicketDetailsMutation } from '../../api/supportApiSlice';
import { FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
import Button from '../common/Button/Button';

interface UpdateTicketDetailsProps {
  ticket: ISupportTicket;
  onUpdate: () => void;
  onCancel: () => void;
}

interface FormErrors {
  subject?: string;
  description?: string;
}

const UpdateTicketDetails: React.FC<UpdateTicketDetailsProps> = ({ ticket, onUpdate, onCancel }) => {
  const [updateTicketDetails, { isLoading }] = useUpdateTicketDetailsMutation();
  const [updatedFields, setUpdatedFields] = useState<Partial<ISupportTicketInput>>({
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    tags: ticket.tags,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Reset success and error messages when updatedFields change
  useEffect(() => {
    if (submissionSuccess || submissionError) {
      setSubmissionSuccess(null);
      setSubmissionError(null);
    }
  }, [updatedFields]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!updatedFields.subject || !updatedFields.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!updatedFields.description || !updatedFields.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    return newErrors;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setSubmissionSuccess(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      await updateTicketDetails({ ticketId: ticket._id, ...updatedFields }).unwrap();
      setSubmissionSuccess('Ticket details updated successfully!');
      onUpdate();
    } catch (error: any) {
      setSubmissionError(error?.data?.message || 'Failed to update ticket details.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Update Ticket Details</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          aria-label="Cancel"
        >
          <FaTimes size={24} />
        </button>
      </div>

      {submissionSuccess && (
        <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg" role="alert">
          {submissionSuccess}
        </div>
      )}
      {submissionError && (
        <div className="mb-4 p-4 text-red-800 bg-red-100 rounded-lg" role="alert">
          {submissionError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={updatedFields.subject || ''}
            onChange={(e) => setUpdatedFields({ ...updatedFields, subject: e.target.value })}
            className={`w-full mt-2 p-4 border ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors`}
            placeholder="Enter ticket subject"
            aria-invalid={errors.subject ? 'true' : 'false'}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600" id="subject-error">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={updatedFields.description || ''}
            onChange={(e) => setUpdatedFields({ ...updatedFields, description: e.target.value })}
            className={`w-full mt-2 p-4 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors`}
            rows={6}
            placeholder="Describe the changes you want to make"
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" id="description-error">
              {errors.description}
            </p>
          )}
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            value={updatedFields.priority || 'Medium'}
            onChange={(e) =>
              setUpdatedFields({ ...updatedFields, priority: e.target.value as ISupportTicketInput['priority'] })
            }
            className="w-full mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Tags Field */}
        <div>
          <label htmlFor="tags" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={updatedFields.tags?.join(', ') || ''}
            onChange={(e) =>
              setUpdatedFields({ ...updatedFields, tags: e.target.value.split(',').map((tag) => tag.trim()) })
            }
            className="w-full mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTicketDetails;
