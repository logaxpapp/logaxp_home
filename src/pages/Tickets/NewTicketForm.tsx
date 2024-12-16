import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { ITicket } from '../../types/ticket';
import { Tag } from '../../types/tag';
import { IUser } from '../../types/user';
import { useCreateTicketMutation, useUpdateTicketMutation } from '../../api/ticketsApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';
import SingleSelect, { OptionType } from '../../components/common/Input/SelectDropdown/TypedSingleSelect';
import MultiSelect, { OptionType as MultiOptionType } from '../../components/common/Input/SelectDropdown/MultiSelect';

interface NewTicketFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  ticket?: ITicket;
}

// Define specific types for each select field
type StatusType = 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Critical';
type PriorityType = 'Low' | 'Medium' | 'High' | 'Urgent';
type CategoryType =
  | 'Technical Issue'
  | 'Access Request'
  | 'Bug Report'
  | 'Feature Request'
  | 'General Inquiry';
type ApplicationType = 'Loga Beauty' | 'GatherPlux' | 'TimeSync' | 'BookMiz';
type DepartmentType = 'HR' | 'IT' | 'Sales' | 'Marketing' | 'Finance';

const NewTicketForm: React.FC<NewTicketFormProps> = ({
  onClose,
  onSuccess,
  ticket,
}) => {
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useFetchAllUsersQuery({ page: 1, limit: 10 });

  const assignedToOptions: OptionType<string>[] =
    usersData?.users.map((user) => ({
      value: user._id,
      label: user.name,
    })) || [];

  // Define options for Select components
  const statusOptions: OptionType<StatusType>[] = [
    { value: 'Open', label: 'Open' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Critical', label: 'Critical' },
  ];

  const priorityOptions: OptionType<PriorityType>[] = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];

  const categoryOptions: OptionType<CategoryType>[] = [
    { value: 'Technical Issue', label: 'Technical Issue' },
    { value: 'Access Request', label: 'Access Request' },
    { value: 'Bug Report', label: 'Bug Report' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'General Inquiry', label: 'General Inquiry' },
  ];

  const applicationOptions: OptionType<ApplicationType>[] = [
    { value: 'Loga Beauty', label: 'Loga Beauty' },
    { value: 'GatherPlux', label: 'GatherPlux' },
    { value: 'TimeSync', label: 'TimeSync' },
    { value: 'BookMiz', label: 'BookMiz' },
  ];

  const departmentOptions: OptionType<DepartmentType>[] = [
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Finance', label: 'Finance' },
  ];

  const tagOptions: MultiOptionType[] = Object.values(Tag).map((tag) => ({
    value: tag,
    label: tag,
  }));

  // Form state
  const [title, setTitle] = useState<string>(ticket ? ticket.title : '');
  const [description, setDescription] = useState<string>(ticket ? ticket.description : '');
  const [status, setStatus] = useState<ITicket['status'] | null>(ticket ? ticket.status : 'Open');
  const [priority, setPriority] = useState<ITicket['priority'] | null>(ticket ? ticket.priority : 'Medium');
  const [category, setCategory] = useState<ITicket['category'] | null>(ticket ? ticket.category : 'Technical Issue');
  const [application, setApplication] = useState<ITicket['application'] | null>(
    ticket ? ticket.application : 'TimeSync'
  );
  const [department, setDepartment] = useState<ITicket['department'] | null>(ticket ? ticket.department : 'IT');
  const [tags, setTags] = useState<Tag[]>(ticket ? ticket.tags : []);
  const [dueDate, setDueDate] = useState<string>(ticket && ticket.dueDate ? ticket.dueDate.substring(0, 10) : '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [assignedTo, setAssignedTo] = useState<IUser | null>(ticket?.assignedTo || null);

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicketMutation, { isLoading: isUpdating }] = useUpdateTicketMutation();

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ticketData: Partial<ITicket> = {
      title,
      description,
      status: (status || 'Open'),
      priority: (priority || 'Medium'),
      category: (category || 'Technical Issue'),
      application: (application || 'TimeSync'),
      department: (department || 'IT'),
      date: ticket ? ticket.date : new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tags: tags as Tag[],
    };

    if (assignedTo) {
      ticketData.assignedTo = assignedTo;
    } else {
      ticketData.assignedTo = undefined;
    }

    try {
      if (ticket) {
        await updateTicketMutation({ ticketId: ticket._id, updates: ticketData }).unwrap();
        showToast('Ticket updated successfully!', 'success');
      } else {
        await createTicket(ticketData).unwrap();
        showToast('Ticket created successfully!', 'success');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to submit ticket:', err);
      const errorMessage =
        err?.data?.message ||
        'Failed to submit ticket. Please ensure all required fields are filled correctly.';
      showToast(errorMessage, 'error');
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Enter a short, descriptive title"
              />
            </div>
            {/* Priority */}
            <div className='text-xs'>
              <SingleSelect
                label="Priority"
                options={priorityOptions}
                value={priority}
                onChange={(value) => setPriority(value)}
                placeholder="Select priority"
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Details & Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Details & Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className='text-xs'>
              <SingleSelect
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(value) => setCategory(value)}
                placeholder="Select category"
                isDisabled={isSubmitting}
              />
            </div>
            {/* Application */}
            <div className='text-xs'>
              <SingleSelect
                label="Application"
                options={applicationOptions}
                value={application}
                onChange={(value) => setApplication(value)}
                placeholder="Select application"
                isDisabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Department */}
            <div>
              <SingleSelect
                label="Department"
                options={departmentOptions}
                value={department}
                onChange={(value) => setDepartment(value)}
                placeholder="Select department"
                isDisabled={isSubmitting}
              />
            </div>
            {/* Status */}
            <div className='text-xs'>
              <SingleSelect
                label="Status"
                options={statusOptions}
                value={status}
                onChange={(value) => setStatus(value)}
                placeholder="Select status"
                isDisabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Due Date */}
            <div className='text-xs'>
              <label className="block  font-medium text-gray-700">
                Due Date (optional)
              </label>
              <input
                type="date"
                className="mt-1 block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {/* Assigned To */}
            <div className='text-xs'>
              <label className="block text-sm font-medium text-gray-700">
                Assign To (optional)
              </label>
              {isUsersLoading ? (
                <p className="text-sm text-gray-500 mt-1">Loading users...</p>
              ) : usersError ? (
                <p className="text-sm text-red-500 mt-1">Failed to load users.</p>
              ) : (
                <SingleSelect
                  label=""
                  options={[{ value: '', label: 'Unassigned' }, ...assignedToOptions]}
                  value={assignedTo?._id || ''}
                  onChange={(value) => {
                    if (value === '') {
                      setAssignedTo(null);
                    } else {
                      const selectedUser = usersData?.users.find((user) => user._id === value) || null;
                      setAssignedTo(selectedUser);
                    }
                  }}
                  placeholder="Select assignee"
                  isDisabled={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-gray-800 ">Additional Options</h3>
          {/* Tags */}
          <div>
            <MultiSelect
              label="Tags"
              options={tagOptions}
              value={tags}
              onChange={(selectedTags) => {
                if (selectedTags) {
                  setTags(selectedTags as Tag[]);
                } else {
                  setTags([]);
                }
              }}
              placeholder="Select tags"
              isDisabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
              placeholder="Provide detailed information about the issue or request"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <input
              type="file"
              multiple
              className="mt-1 block w-full text-xs text-gray-500 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments(Array.from(e.target.files));
                }
              }}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1">
              Optional: You can attach screenshots or documents.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? ticket
                ? 'Updating...'
                : 'Creating...'
              : ticket
              ? 'Update Ticket'
              : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTicketForm;
