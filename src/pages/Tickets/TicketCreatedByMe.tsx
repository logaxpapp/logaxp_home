import React, { useState } from 'react';
import { useFetchCreatedTicketsQuery } from '../../api/ticketsApi';
import Card from '../../components/common/UI/Card';
import Grid from '../../components/common/Layout/Grid';
import Pagination from '../../components/common/Pagination/Pagination';
import { ITicket } from '../../types/ticket';

const TicketCreatedByMe: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const skip = (currentPage - 1) * ticketsPerPage;

  const { data: ticketsData, isLoading, isError } = useFetchCreatedTicketsQuery({
    skip,
    limit: ticketsPerPage,
  });

  const tickets = ticketsData?.tickets || [];
  const totalTickets = ticketsData?.total || 0;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-500">
            Tickets Created By Me
            <span className="text-blue-600 font-semibold text-lg ml-2 dark:text-blue-400">
            ({totalTickets})
            </span>
        </h1>

      {/* Loading or Error Messages */}
      {isLoading && (
        <p className="text-center text-gray-600 dark:text-gray-300 animate-pulse">
          Loading tickets...
        </p>
      )}
      {isError && (
        <p className="text-center text-red-600 dark:text-red-400">
          Error loading tickets. Please try again later.
        </p>
      )}
      {!isLoading && !isError && tickets.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          You haven't created any tickets yet.
        </p>
      )}

      {/* Tickets List */}
      {!isLoading && !isError && tickets.length > 0 && (
        <>
          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap={6}>
            {tickets.map((ticket: ITicket) => (
              <Card
                key={ticket._id}
                className="border-l-4 border-blue-500 bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-md p-4"
              >
                {/* Ticket Title */}
                <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100 truncate">
                  {ticket.title}
                </h3>

                {/* Ticket Description */}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {ticket.description}
                </p>

                {/* Ticket Metadata */}
                <div className="mt-4 flex justify-between items-center text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    Created On:{' '}
                    <span className="text-gray-700 dark:text-gray-100">
                      {new Date(ticket.date).toLocaleDateString()}
                    </span>
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </Card>
            ))}
          </Grid>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalTickets / ticketsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TicketCreatedByMe;
