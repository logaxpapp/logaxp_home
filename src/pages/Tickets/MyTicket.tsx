import React, { Fragment, useState } from 'react';
import {
  useFetchTicketsQuery,
  useFetchPersonalTicketsQuery, // New hook for fetching personal tickets
  useDeleteTicketMutation,
  useUpdateTicketMutation,
} from '../../api/ticketsApi';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/UI/Card';
import Grid from '../../components/common/Layout/Grid';
import Button from '../../components/common/Button/Button';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import Modal from '../../components/common/Feedback/Modal';
import NewTicketForm from './NewTicketForm';
import { ITicket } from '../../types/ticket';
import { useToast } from '../../features/Toast/ToastContext';

const MyTicket: React.FC = () => {
  const navigate = useNavigate();
  const [showPersonalTickets, setShowPersonalTickets] = useState(false); // State to toggle between all and personal tickets
  const { showToast } = useToast();

  // Fetch tickets based on the selected view
  const {
    data: ticketsData,
    isLoading,
    isError,
    error,
    refetch,
  } = showPersonalTickets ? useFetchPersonalTicketsQuery() : useFetchTicketsQuery();

  const [deleteTicket] = useDeleteTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const ticketCount = ticketsData?.tickets.length || 0;

  // State for modal visibility and selected ticket
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

  // Handle modal open and close
  const openModal = (ticket?: ITicket) => {
    setSelectedTicket(ticket || null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Callback after successful ticket creation or update
  const handleSuccess = () => {
    refetch(); // Refetch tickets
  };

  // Slice the tickets array to display only the first six tickets
  const displayedTickets = ticketsData?.tickets.slice(0, 9) || [];

  // Tag colors mapping based on urgency/status
  const tagColors: { [key: string]: string } = {
    Urgent: 'red',
    'Non-Urgent': 'yellow',
    Pending: 'yellow',
    Critical: 'red',
    Open: 'green',
    Closed: 'gray',
    // ... other statuses
  };

  // Handle Delete Ticket
  const handleDelete = async (_id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (confirmed) {
      try {
        await deleteTicket(_id).unwrap();
        showToast('Ticket deleted successfully!', 'success');
        refetch(); // Refetch tickets after deletion
      } catch (err: any) {
        console.error('Failed to delete ticket:', err);
        const errorMessage =
          err?.data?.message ||
          'Failed to delete ticket. Please try again later.';
        showToast(errorMessage, 'error');
      }
    }
  };

  // Handle Change Status
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

  const handleAllTickets = () => {
    navigate('all');
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

  return (
    <div className="bg-blue-50 p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-semibold text-blue-800 flex items-center font-primary">
            {showPersonalTickets ? 'My Personal Tickets' : 'All Tickets'}
            <span className="text-blue-600 font-semibold text-lg ml-2">
              ({ticketCount})
            </span>
          </h1>
          <p className="text-gray-500">
            {showPersonalTickets ? 'View tickets assigned to you or created by you' : 'Manage and track all tickets'}
          </p>
        </div>
        <div className="flex space-x-4">
         
          <Button
            variant="primary"
            size="medium"
            onClick={() => openModal()}
          >
            + New Ticket
          </Button>
        </div>
      </div>

      {/* Tickets Grid */}
      <Grid columns={{ default: 1, md: 2, lg: 3 }} gap={4}>
        {displayedTickets.map((ticket) => (
          <Card
            key={ticket._id}
            className="relative w-full border-l-4 border-gray-400 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            padding="p-4"
          >
            {/* Ticket Content */}
            <div>
              <div className="flex justify-between items-center">
                <Link to={`${ticket._id}`}>
                  <h3 className="text-md font-semibold text-gray-700 hover:text-blue-500">
                    {ticket.title}
                  </h3>
                </Link>
                {/* Three-dot action menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex justify-center p-1 rounded-full hover:bg-gray-200">
                    <FaEllipsisV className="text-gray-500 hover:text-gray-700" />
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
                    <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-2 py-2 text-sm text-gray-700`}
                            onClick={() => openModal(ticket)} // Open modal in edit mode
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
                            onClick={() => handleDelete(ticket._id)}
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
                            onClick={() =>
                              handleStatusChange(
                                ticket._id,
                                ticket.status === 'Open' ? 'Closed' : 'Open'
                              )
                            }
                          >
                            <span className="mr-2">
                              {ticket.status === 'Open' ? '🔒' : '🔓'}
                            </span>
                            {ticket.status === 'Open' ? 'Close Ticket' : 'Reopen Ticket'}
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <p className="text-gray-500 mt-2 text-sm line-clamp-3">
                {ticket.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {ticket.tags.map((tag) => {
                  const color = tagColors[tag] || 'gray';
                  return (
                    <span
                      key={tag}
                      className={`bg-${color}-100 text-${color}-800 text-xs rounded-full px-2 py-0.5`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'Closed'
                    ? 'bg-green-100 text-green-800'
                    : ticket.status === 'Open'
                    ? 'bg-blue-100 text-blue-800'
                    : ticket.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {ticket.status}
              </span>
              <span className="ml-2 text-gray-500 text-xs">- {ticket.application}</span>
            </div>
          </Card>
        ))}
      </Grid>

      {/* See All Button */}
      <div className="flex justify-center mt-6">
        <Button variant="primary" size="medium" onClick={handleAllTickets}>
          See All Tickets
        </Button>
      </div>

      {/* New/Edit Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedTicket ? 'Edit Ticket' : 'Create New Ticket'}
      >
        <NewTicketForm
          onClose={closeModal}
          onSuccess={handleSuccess}
          ticket={selectedTicket || undefined}
        />
      </Modal>
    </div>
  );
};

export default MyTicket;
