// src/components/Tickets/NewTicketForm.tsx

import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import { ITicket } from '../../types/ticket';
import { Tag } from '../../types/tag';
import { IUser } from '../../types/user';
import {useCreateTicketMutation, useUpdateTicketMutation, } from '../../api/ticketsApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';
import SingleSelect, { OptionType } from '../../components/common/Input/SelectDropdown/TypedSingleSelect';
import MultiSelect, {OptionType as MultiOptionType, } from '../../components/common/Input/SelectDropdown/MultiSelect';

interface NewTicketFormProps {
  onClose: () => void;
  onSuccess?: () => void; // Optional callback after successful creation or update
  ticket?: ITicket; // Optional ticket prop for edit mode
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
  // Fetch users data for "Assign To"
  // Fetch users data for "Assign To"
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

  // Form state variables with initial values based on the mode
  const [title, setTitle] = useState<string>(ticket ? ticket.title : '');
  const [description, setDescription] = useState<string>(
    ticket ? ticket.description : ''
  );

  // Updated state types to match ITicket interface
  const [status, setStatus] = useState<ITicket['status'] | null>(
    ticket ? ticket.status : 'Open'
  );
  const [priority, setPriority] = useState<ITicket['priority'] | null>(
    ticket ? ticket.priority : 'Medium'
  );
  const [category, setCategory] = useState<ITicket['category'] | null>(
    ticket ? ticket.category : 'Technical Issue'
  );
  const [application, setApplication] = useState<ITicket['application'] | null>(
    ticket ? ticket.application : 'TimeSync'
  );
  const [department, setDepartment] = useState<ITicket['department'] | null>(
    ticket ? ticket.department : 'IT'
  );

  const [tags, setTags] = useState<Tag[]>(ticket ? ticket.tags : []);


  const [dueDate, setDueDate] = useState<string>(
    ticket && ticket.dueDate ? ticket.dueDate.substring(0, 10) : ''
  );
  const [attachments, setAttachments] = useState<File[]>([]);

  const [assignedTo, setAssignedTo] = useState<IUser | null>(
  ticket?.assignedTo || null
);

  // Create and Update Ticket mutation hooks
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicketMutation, { isLoading: isUpdating }] = useUpdateTicketMutation();

  // Toast notification
  const { showToast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the ticket data with correct types using type assertions
    const ticketData: Partial<ITicket> = {
      title,
      description,
      status: (status || 'Open') as ITicket['status'],
      priority: (priority || 'Medium') as ITicket['priority'],
      category: (category || 'Technical Issue') as ITicket['category'],
      application: (application || 'TimeSync') as ITicket['application'],
      department: (department || 'IT') as ITicket['department'],
      date: ticket ? ticket.date : new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tags: tags as Tag[],
    };

    // Include assignedTo only if a valid user is selected
    if (assignedTo) {
      ticketData.assignedTo = assignedTo; // Assuming API accepts user ID
    } else {
      ticketData.assignedTo = undefined;
    }

    try {
      if (ticket) {
        // Edit Mode: Update existing ticket
        await updateTicketMutation({ ticketId: ticket._id, updates: ticketData }).unwrap();
        showToast('Ticket updated successfully!', 'success');
      } else {
        // Create Mode: Create new ticket
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

  return (
    <form onSubmit={handleSubmit}>
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Title and Priority */}
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
              disabled={isCreating || isUpdating}
            />
          </div>
          {/* Priority */}
          <div>
            <SingleSelect
              label="Priority"
              options={priorityOptions}
              value={priority}
              onChange={(value) => setPriority(value)}
              placeholder="Select priority"
              isDisabled={isCreating || isUpdating}
            />
          </div>
        </div>

        {/* Category and Application */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <SingleSelect
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select category"
              isDisabled={isCreating || isUpdating}
            />
          </div>
          {/* Application */}
          <div>
            <SingleSelect
              label="Application"
              options={applicationOptions}
              value={application}
              onChange={(value) => setApplication(value)}
              placeholder="Select application"
              isDisabled={isCreating || isUpdating}
            />
          </div>
        </div>

        {/* Department and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <SingleSelect
              label="Department"
              options={departmentOptions}
              value={department}
              onChange={(value) => setDepartment(value)}
              placeholder="Select department"
              isDisabled={isCreating || isUpdating}
            />
          </div>
          {/* Status */}
          <div>
            <SingleSelect
              label="Status"
              options={statusOptions}
              value={status}
              onChange={(value) => setStatus(value)}
              placeholder="Select status"
              isDisabled={isCreating || isUpdating}
            />
          </div>
        </div>

        {/* Due Date and Assigned To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date (optional)
            </label>
            <input
              type="date"
              className="mt-1 block w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isCreating || isUpdating}
            />
          </div>
          {/* Assigned To */}
          {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign To (optional)
          </label>
          {isUsersLoading ? (
            <p>Loading users...</p>
          ) : usersError ? (
            <p className="text-red-500">Failed to load users.</p>
          ) : (
            <SingleSelect
              label=""
              options={[
                { value: '', label: 'Unassigned' }, // Option for unassigned
                ...assignedToOptions,
              ]}
              value={assignedTo?._id || ''} // Use the user ID if assignedTo is not null
              onChange={(value) => {
                if (value === '') {
                  setAssignedTo(null); // Unassigned
                } else {
                  // Find the user object corresponding to the selected value (user ID)
                  const selectedUser = usersData?.users.find((user) => user._id === value) || null;
                  setAssignedTo(selectedUser); // Set the selected user object or null
                }
              }}
              placeholder="Select assignee"
              isDisabled={isCreating || isUpdating}
            />
          )}
        </div>

        </div>

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
            isDisabled={isCreating || isUpdating}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            disabled={isCreating || isUpdating}
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
            className="mt-1 block w-full text-sm text-gray-500"
            onChange={(e) => {
              if (e.target.files) {
                setAttachments(Array.from(e.target.files));
              }
            }}
            disabled={isCreating || isUpdating}
          />
        </div>
      </div>
      {/* Form Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating
            ? ticket
              ? 'Updating...'
              : 'Creating...'
            : ticket
            ? 'Update Ticket'
            : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};

export default NewTicketForm;
