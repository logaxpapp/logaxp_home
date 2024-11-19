import React, { useState, useEffect, FormEvent } from 'react';
import {
  useCreateSupportTicketMutation,
  useUpdateTicketDetailsMutation,
  useFetchSupportTicketByIdQuery,
} from '../../api/supportApiSlice';
import { FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import Button from '../common/Button/Button';
import { ISupportTicketInput } from '../../types/support';

interface NewTicketFormProps {
  ticketId?: string; // Optional for editing
  onSuccess?: () => void; // Callback when ticket is created or updated
  onCancel?: () => void; // Callback when form is canceled
}

interface FormErrors {
  subject?: string;
  description?: string;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ ticketId, onSuccess, onCancel }) => {
  const [ticket, setTicket] = useState<ISupportTicketInput>({
    subject: '',
    description: '',
    priority: 'Medium',
    tags: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const [createTicket, { isLoading: isCreating }] = useCreateSupportTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketDetailsMutation();
  const { data: existingTicket, isFetching } = useFetchSupportTicketByIdQuery(ticketId!, {
    skip: !ticketId,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingTicket) {
      setTicket({
        subject: existingTicket.subject,
        description: existingTicket.description,
        priority: existingTicket.priority,
        tags: existingTicket.tags,
      });
    }
  }, [existingTicket]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!ticket.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!ticket.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
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
      if (ticketId) {
        // Update existing ticket
        await updateTicket({ ticketId, ...ticket }).unwrap();
        setSubmissionSuccess('Ticket updated successfully!');
      } else {
        // Create new ticket
        await createTicket(ticket).unwrap();
        setSubmissionSuccess('Ticket created successfully!');
        setTicket({ subject: '', description: '', priority: 'Medium', tags: [] });
      }
      onSuccess?.(); // Call onSuccess callback
    } catch (err: any) {
      setSubmissionError(err?.data?.message || 'Failed to submit ticket.');
    }
  };

  return (
    <div className="mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
          {ticketId ? 'Edit Support Ticket' : 'Submit a New Ticket'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Cancel"
          >
            <FaTimes size={24} />
          </button>
        )}
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={ticket.subject}
            onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
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
            value={ticket.description}
            onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
            className={`w-full mt-2 p-4 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors`}
            rows={6}
            placeholder="Describe your issue"
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
            value={ticket.priority}
            onChange={(e) =>
              setTicket({ ...ticket, priority: e.target.value as ISupportTicketInput['priority'] })
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
            value={ticket.tags?.join(', ') || ''}
            onChange={(e) =>
              setTicket({ ...ticket, tags: e.target.value.split(',').map((tag) => tag.trim()) })
            }
            className="w-full mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              type="button"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none"
            >
              Cancel
            </button>
          )}
          <Button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            disabled={isCreating || isUpdating || isFetching}
          >
            {(isCreating || isUpdating) ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {ticketId ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                {ticketId ? 'Update Ticket' : 'Submit Ticket'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTicketForm;
