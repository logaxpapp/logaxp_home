// src/pages/Tickets/MyTicket.tsx

import React, { Fragment, useState } from 'react';
import {
  useFetchTicketsQuery,
  useFetchPersonalTicketsQuery,
  useDeleteTicketMutation,
  useUpdateTicketMutation,
} from '../../api/ticketsApi';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/UI/Card';
import Grid from '../../components/common/Layout/Grid';
import Button from '../../components/common/Button/Button';
import { FaEdit, FaTrash, FaEllipsisV, FaEye } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import Modal from '../../components/common/Feedback/Modal';
import NewTicketForm from './NewTicketForm';
import { ITicket } from '../../types/ticket';
import { useToast } from '../../features/Toast/ToastContext';
import Pagination from '../../components/common/Pagination/Pagination';
import TicketWatchers from './TicketWatchers';

const MyTicket: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State to toggle between all and personal tickets
  const [showPersonalTickets, setShowPersonalTickets] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 9; // Adjust as needed

  // Determine skip value for pagination
  const skip = (currentPage - 1) * ticketsPerPage;

  // Fetch tickets based on current view and pagination
  const {
    data: ticketsData,
    isLoading,
    isError,
    error,
    refetch,
  } = showPersonalTickets
    ? useFetchPersonalTicketsQuery() // personal tickets currently don't handle skip/limit in this snippet
    : useFetchTicketsQuery({
        skip,
        limit: ticketsPerPage,
      });

  const [deleteTicket] = useDeleteTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  const ticketCount = ticketsData?.total || 0;
  const tickets = ticketsData?.tickets || [];

  // State for modal visibility and selected ticket
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

  const openModal = (ticket?: ITicket) => {
    setSelectedTicket(ticket || null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    refetch();
  };

  // Handle Delete Ticket
  const handleDelete = async (_id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (confirmed) {
      try {
        await deleteTicket(_id).unwrap();
        showToast('Ticket deleted successfully!', 'success');
        refetch();
      } catch (err: any) {
        console.error('Failed to delete ticket:', err);
        const errorMessage = err?.data?.message || 'Failed to delete ticket. Please try again later.';
        showToast(errorMessage, 'error');
      }
    }
  };

  // Handle Change Status
  const handleStatusChange = async (_id: string, newStatus: ITicket['status']) => {
    try {
      await updateTicket({ ticketId: _id, updates: { status: newStatus } }).unwrap();
      showToast('Ticket status updated successfully!', 'success');
      refetch();
    } catch (err: any) {
      console.error('Failed to update ticket status:', err);
      const errorMessage = err?.data?.message || 'Failed to update ticket status. Please try again later.';
      showToast(errorMessage, 'error');
    }
  };

  const handleAllTickets = () => {
    navigate('all');
  };

  // Tag colors mapping based on urgency/status
  const tagColors: { [key: string]: string } = {
    Urgent: 'red',
    'Non-Urgent': 'yellow',
    Pending: 'yellow',
    Critical: 'red',
    Open: 'green',
    Closed: 'gray',
  };

  // State to track which tickets have their watchers visible
  const [expandedWatchers, setExpandedWatchers] = useState<string[]>([]);

  const toggleWatchers = (ticketId: string) => {
    setExpandedWatchers((prev) =>
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-blue-800 font-primary flex items-center">
            {showPersonalTickets ? 'My Personal Tickets' : 'All Tickets'}
            <span className="text-blue-600 font-semibold text-lg ml-2">
              ({ticketCount})
            </span>
          </h1>
          <p className="text-gray-500">
            {showPersonalTickets ? 'View tickets assigned to you or created by you' : 'Manage and track all tickets'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => {
              setShowPersonalTickets((prev) => !prev);
              setCurrentPage(1);
            }}
          >
            {showPersonalTickets ? 'All Tickets' : 'MyTickets'}
          </Button>
          <Button variant="primary" onClick={() => openModal()}>
            + New Ticket
          </Button>
        </div>
      </div>

      {isLoading && <div className="text-center mt-10">Loading tickets...</div>}
      {isError && (
        <div className="text-center mt-10 text-red-500">
          Failed to load tickets: {error?.toString()}
        </div>
      )}

      {!isLoading && !isError && tickets.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          No tickets found.
        </div>
      )}

      {!isLoading && !isError && tickets.length > 0 && (
        <>
          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap={4}>
            {tickets.map((ticket) => {
              const watchersExpanded = expandedWatchers.includes(ticket._id);

              return (
                <Card
                  key={ticket._id}
                  className="relative w-full border-l-4 border-gray-400 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                  padding="p-4"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <Link to={`${ticket._id}`}>
                        <h3 className="text-md font-semibold text-gray-700 hover:text-blue-500 line-clamp-1">
                          {ticket.title}
                        </h3>
                      </Link>
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
                                  onClick={() => openModal(ticket)}
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

                    {/* Watchers Toggle */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
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
                      <button
                        onClick={() => toggleWatchers(ticket._id)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        {watchersExpanded ? 'Hide Watchers' : 'Show Watchers'}
                      </button>
                    </div>

                    {/* Render watchers if expanded */}
                    <TicketWatchers ticketId={ticket._id} expanded={watchersExpanded} />
                  </div>
                </Card>
              );
            })}
          </Grid>

          {/* Pagination */}
          {!showPersonalTickets && ticketCount > ticketsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(ticketCount / ticketsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  refetch();
                }}
              />
            </div>
          )}

          {/* See All Tickets button */}
          <div className="flex justify-center mt-6">
            <Button variant="primary" size="medium" onClick={handleAllTickets}>
              Tickets Table
            </Button>
          </div>
        </>
      )}

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
