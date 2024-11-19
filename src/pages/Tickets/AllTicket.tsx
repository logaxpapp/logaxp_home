// src/components/Tickets/AllTicket.tsx

import React, { useState, Fragment } from 'react';
import {
  useFetchTicketsQuery,
  useDeleteTicketMutation,
  useUpdateTicketMutation,
  useAssignTicketMutation,
  
} from '../../api/ticketsApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaTrash,
  FaEllipsisV,
  FaArrowAltCircleLeft,
  FaEdit,
} from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Pagination from '../../components/common/Pagination/Pagination';
import DataTable from '../../components/common/DataTable/DataTable';
import SingleSelect from '../../components/common/Input/SelectDropdown/SingleSelect';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import NewTicketForm from './NewTicketForm';
import { ITicket } from '../../types/ticket';
import { IUser } from '../../types/user';
import { useToast } from '../../features/Toast/ToastContext';
import { Menu, Transition } from '@headlessui/react';
import { OptionType } from '../../components/common/Input/SelectDropdown/SingleSelect';

const AllTicket: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useFetchTicketsQuery();
  const [deleteTicket] = useDeleteTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [assignTicket] = useAssignTicketMutation();
  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({ page: 1, limit: 10 });
  const ticketCount = data?.tickets.length || 0;

  // State variables for search, filter, sort, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState<keyof ITicket>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  // State variables for modals
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<ITicket | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicketForView, setSelectedTicketForView] = useState<ITicket | null>(null);

  // State variables for ConfirmModal
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  // State variables for AssignTicketModal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [ticketToAssign, setTicketToAssign] = useState<ITicket | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { showToast } = useToast();

  // Handle modal open and close for Create/Edit
  const openCreateEditModal = (ticket?: ITicket) => {
    if (ticket) {
      setSelectedTicketForEdit(ticket);
    } else {
      setSelectedTicketForEdit(null);
    }
    setIsCreateEditModalOpen(true);
  };
  const closeCreateEditModal = () => setIsCreateEditModalOpen(false);

  // Handle modal open and close for View
  const openViewModal = (ticket: ITicket) => {
    setSelectedTicketForView(ticket);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => setIsViewModalOpen(false);

  // Handle modal open and close for Assign
  const openAssignModal = (ticket: ITicket) => {
    setTicketToAssign(ticket);
    setSelectedUser(null); // Reset selected user
    setIsAssignModalOpen(true);
  };
  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setTicketToAssign(null);
    setSelectedUser(null);
  };

  // Callback after successful ticket creation or update
  const handleSuccess = () => {
    refetch(); // Refetch tickets
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting
  const handleSort = (column: keyof ITicket) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle Delete Ticket - Open ConfirmModal
  const handleDelete = (_id: string) => {
    setTicketToDelete(_id);
    setIsConfirmDeleteOpen(true);
  };

  // Map usersData to match the OptionType structure
      const userOptions: OptionType[] =
      usersData?.users.map((user) => ({
        value: user._id,
        label: user.name,
      })) || [];


  // Confirm Deletion
  const confirmDelete = async () => {
    if (ticketToDelete) {
      try {
        await deleteTicket(ticketToDelete).unwrap();
        showToast('Ticket deleted successfully!', 'success');
        refetch(); // Refetch tickets after deletion
      } catch (err: any) {
        console.error('Failed to delete ticket:', err);
        const errorMessage =
          err?.data?.message ||
          'Failed to delete ticket. Please try again later.';
        showToast(errorMessage, 'error');
      } finally {
        setIsConfirmDeleteOpen(false);
        setTicketToDelete(null);
      }
    }
  };

  // Handle Assign Ticket
  const handleAssignTicket = async () => {
    if (ticketToAssign && selectedUser) {
      try {
        await assignTicket({
          ticketId: ticketToAssign._id,
          assigneeId: selectedUser._id, // Assuming user has an 'id' field
        }).unwrap();
        showToast('Ticket assigned successfully!', 'success');
        refetch(); // Refetch tickets after assignment
        closeAssignModal();
      } catch (err: any) {
        console.error('Failed to assign ticket:', err);
        const errorMessage =
          err?.data?.message ||
          'Failed to assign ticket. Please try again later.';
        showToast(errorMessage, 'error');
      }
    } else {
      showToast('Please select a user to assign.', 'error');
    }
  };

  // Handle Change Status (if still needed)
  const handleStatusChange = async (_id: string, newStatus: ITicket['status']) => {
    try {
      await updateTicket({ ticketId: _id, updates: { status: newStatus } }).unwrap();
      showToast('Ticket status updated successfully!', 'success');
      refetch(); // Refetch tickets after status update
    } catch (err: any) {
      console.error('Failed to update ticket status:', err);
      const errorMessage =
        err?.data?.message ||
        'Failed to update ticket status. Please try again later.';
      showToast(errorMessage, 'error');
    }
  };

  const handleTickets = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading tickets...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load tickets: {error.toString()}
      </div>
    );
  }

  // Filtered and sorted tickets
  const filteredTickets = data?.tickets
    .filter((ticket) => {
      const searchMatch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || ticket.status === statusFilter;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      let compare = 0;
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        compare = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        compare = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        compare = aValue.getTime() - bValue.getTime();
      } else if (
        aValue &&
        bValue &&
        typeof aValue === 'object' &&
        typeof bValue === 'object'
      ) {
        // If the sort column is an object (e.g., assignedTo)
        const aField = (aValue as any).name || '';
        const bField = (bValue as any).name || '';
        compare = aField.localeCompare(bField);
      } else {
        compare = 0;
      }
      return sortDirection === 'asc' ? compare : -compare;
    }) || [];

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Tag colors mapping based on urgency/status
  const tagColors: { [key: string]: string } = {
    Urgent: 'red',
    'Non-Urgent': 'yellow',
    Pending: 'yellow',
    Critical: 'red',
    Open: 'green',
    Closed: 'gray',
    'In Progress': 'blue',
    Resolved: 'purple',
    // ... other statuses
  };

  // Columns configuration
  const columns = [
    {
      header: 'Title',
      accessor: (ticket: ITicket) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering row click
            openViewModal(ticket);
          }}
          className="text-blue-500 hover:underline capitalize"
        >
          {ticket.title}
        </button>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (ticket: ITicket) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Priority',
      accessor: 'priority' as keyof ITicket,
      sortable: true,
    },
    {
      header: 'Created Date',
      accessor: (ticket: ITicket) =>
        ticket.date ? new Date(ticket.date).toLocaleDateString() : 'N/A',
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: (ticket: ITicket) => (
        <ActionMenu
          ticket={ticket}
          onEdit={() => openCreateEditModal(ticket)}
          onDelete={() => handleDelete(ticket._id)}
          onAssign={() => openAssignModal(ticket)}
        />
      ),
      sortable: false,
    },
  ];

  // Function to get status badge classes
  const getStatusBadgeClasses = (status: ITicket['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Action Menu Component
  interface ActionMenuProps {
    ticket: ITicket;
    onEdit: () => void;
    onDelete: () => void;
    onAssign: () => void;
  }

  const ActionMenu: React.FC<ActionMenuProps> = ({
    ticket,
    onEdit,
    onDelete,
    onAssign,
  }) => {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex justify-center p-1 rounded-full hover:bg-gray-200">
          <FaEllipsisV className="text-gray-500 hover:text-gray-700 border px-1 bg-yellow-200" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-2 py-2 text-sm text-gray-700`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    onEdit();
                  }}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-2 py-2 text-sm text-red-600`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    onDelete();
                  }}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-2 py-2 text-sm text-blue-600`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    onAssign();
                  }}
                >
                  Assign Ticket
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  // Function to get tag classes
  const getTagClasses = (tag: string) => {
    const color = tagColors[tag] || 'gray';
    return `bg-${color}-100 text-${color}-800 text-xs rounded-full px-2 py-0.5`;
  };

  return (
    <div className="p-6 min-h-screen bg-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Back Button */}
      <div className="mb-4">
        <FaArrowAltCircleLeft
          className="bg-red-500 text-white h-8 w-8 p-1 rounded-full cursor-pointer"
          onClick={handleTickets}
          title="Go Back"
        />
      </div>

      {/* Header Section */}
     
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h1 className="text-3xl font-semibold text-blue-800 mb-4 md:mb-0 font-primary">
          All Tickets{' '}
          <span className="text-sm bg-green-200 py-1 px-2 rounded-full">
            ({ticketCount} Tickets)
          </span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-center font-primary">
          {/* Search Bar */}
          <div className="relative text-gray-600 mb-4 md:mb-0 md:mr-4">
            <input
              type="search"
              name="search"
              placeholder="Search tickets..."
              className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none border border-gray-300"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="h-10 pl-3 pr-8 rounded-full border border-gray-300 bg-white text-gray-600 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <DataTable
          data={currentTickets}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          //onRowClick={(ticket) => openViewModal(ticket)} // Optional: You can remove this if you don't want row clicks
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstTicket + 1} to{' '}
          {indexOfLastTicket > filteredTickets.length ? filteredTickets.length : indexOfLastTicket}{' '}
          of {filteredTickets.length} tickets
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create/Edit Ticket Modal */}
      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title={selectedTicketForEdit ? 'Edit Ticket' : 'Create New Ticket'}
      >
        <NewTicketForm
          onClose={closeCreateEditModal}
          onSuccess={handleSuccess}
          ticket={selectedTicketForEdit || undefined} // Pass the selected ticket for edit mode
        />
      </Modal>

      {/* View Ticket Modal */}
      {selectedTicketForView && (
        <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Ticket Details">
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedTicketForView.title}</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                selectedTicketForView.status
              )}`}
            >
              {selectedTicketForView.status}
            </span>
          </div>
      
          {/* Ticket Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">
                <strong>Priority:</strong>{' '}
                <span className="capitalize">{selectedTicketForView.priority || 'N/A'}</span>
              </p>
              <p className="text-gray-600">
                <strong>Category:</strong> {selectedTicketForView.category}
              </p>
              <p className="text-gray-600">
                <strong>Application:</strong> {selectedTicketForView.application}
              </p>
              <p className="text-gray-600">
                <strong>Department:</strong> {selectedTicketForView.department}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Assigned To:</strong>{' '}
                {selectedTicketForView.assignedTo ? (
                  <span className="inline-flex items-center gap-2">
                    {selectedTicketForView.assignedTo.name || selectedTicketForView.assignedTo.email}
                  </span>
                ) : (
                  'Unassigned'
                )}
              </p>
              <p className="text-gray-600">
                <strong>Created Date:</strong>{' '}
                {selectedTicketForView.date
                  ? new Date(selectedTicketForView.date).toLocaleString()
                  : 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Due Date:</strong>{' '}
                {selectedTicketForView.dueDate
                  ? new Date(selectedTicketForView.dueDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
      
          {/* Tags */}
          <div>
            <strong className="text-gray-700">Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTicketForView.tags.map((tag, index) => (
                <span
                  key={index}
                  className={getTagClasses(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
      
          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <strong className="text-gray-700">Description:</strong>
            <p className="mt-2 text-gray-600">{selectedTicketForView.description}</p>
          </div>
      
          {/* Comments Section */}
          {selectedTicketForView.comments && selectedTicketForView.comments.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <strong className="text-gray-700">Comments:</strong>
              <div className="mt-3 space-y-3">
                {selectedTicketForView.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-white shadow-sm p-3 rounded-lg flex-1">
                      <p className="text-sm font-semibold text-gray-800">{comment.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      
          {/* Footer Actions */}
          
        </div>
      </Modal>
      
      )}

      {/* Assign Ticket Modal */}
      {ticketToAssign && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={closeAssignModal}
          title={`Assign Ticket: ${ticketToAssign.title}`}
        >
          <div className="space-y-4">
            <p>Select a user to assign this ticket to:</p>
            {isUsersLoading ? (
              <div>Loading users...</div>
            ) : (
              <SingleSelect
              options={userOptions}
              value={selectedUser ? selectedUser._id : null}
              onChange={(userId) => {
                const selected = usersData?.users.find((user) => user._id === userId) || null;
                setSelectedUser(selected);
              }}
              placeholder="Select a user..."
            />

            )}
          </div>
          {/* Footer Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary" onClick={closeAssignModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignTicket}
              disabled={!selectedUser || isUsersLoading}
            >
              Assign
            </Button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />
    </div>
  );
};

export default AllTicket;
