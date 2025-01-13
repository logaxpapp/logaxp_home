import React, { useState } from 'react';
import {
  useFetchAssignedTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from '../../api/ticketsApi';
import { useToast } from '../../features/Toast/ToastContext';
import Card from '../../components/common/UI/Card';
import Grid from '../../components/common/Layout/Grid';
import Button from '../../components/common/Button/Button';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import TicketWatchers from './TicketWatchers';
import Pagination from '../../components/common/Pagination/Pagination';

const TicketsAssignedToMe: React.FC = () => {
  const { showToast } = useToast();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 9; // Adjust as needed

  // Determine skip value for pagination
  const skip = (currentPage - 1) * ticketsPerPage;

  // Fetch tickets assigned to the user
  const {
    data: ticketsData,
    isLoading,
    isError,
    refetch,
  } = useFetchAssignedTicketsQuery({
    skip,
    limit: ticketsPerPage,
  });

  const [deleteTicket] = useDeleteTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  const ticketCount = ticketsData?.total || 0;
  const tickets = ticketsData?.tickets || [];

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
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-700">
      <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-500">
        Tickets Assigned to Me
        <span className="text-blue-600 font-semibold text-lg ml-2">
          ({ticketCount})
        </span>
      </h1>
      <p className="text-gray-500 dark:text-white mb-4">
        Manage and track tickets assigned to you.
      </p>

      {isLoading && <div className="text-center mt-10">Loading tickets...</div>}
      {isError && (
        <div className="text-center mt-10 text-red-500">
          Failed to load tickets.
        </div>
      )}
      {!isLoading && !isError && tickets.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          No tickets assigned to you.
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
                      <h3 className="text-md font-semibold text-gray-700 hover:text-blue-500 line-clamp-1 dark:text-gray-50">
                        {ticket.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 mt-2 text-sm line-clamp-3 dark:text-gray-300">
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

                    <div className="mt-4 flex items-center justify-between">
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
          {ticketCount > ticketsPerPage && (
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
        </>
      )}
    </div>
  );
};

export default TicketsAssignedToMe;
