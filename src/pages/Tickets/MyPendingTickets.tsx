import React, { useState } from 'react';
import { useFetchTicketsByStatusQuery } from '../../api/ticketsApi';
import Card from '../../components/common/UI/Card';
import Grid from '../../components/common/Layout/Grid';
import Pagination from '../../components/common/Pagination/Pagination';

const MyPendingTickets: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const skip = (currentPage - 1) * ticketsPerPage;

  const { data, isLoading, isError } = useFetchTicketsByStatusQuery({
    status: 'Pending',
    skip,
    limit: ticketsPerPage,
  });

  const tickets = data?.tickets || [];
  const totalTickets = data?.total || 0;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-yellow-800 dark:text-yellow-400">
            My Pending Tickets
            <span className="text-yellow-600 dark:text-yellow-300 font-medium text-lg ml-2">
              ({totalTickets})
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Review and take action on tickets awaiting resolution.
          </p>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center mt-20">
            <p className="text-gray-600 dark:text-gray-400">Loading tickets...</p>
          </div>
        )}
        {isError && (
          <div className="text-center mt-20 text-red-500">
            <p>Failed to load tickets. Please try again later.</p>
          </div>
        )}
        {!isLoading && tickets.length === 0 && (
          <div className="text-center mt-20 text-gray-600 dark:text-gray-400">
            <p>No pending tickets found.</p>
          </div>
        )}

        {/* Ticket Cards */}
        {!isLoading && tickets.length > 0 && (
          <>
            <Grid columns={{ default: 1, md: 2, lg: 3 }} gap={6}>
              {tickets.map((ticket) => (
                <Card
                  key={ticket._id}
                  className="border-l-4 border-yellow-500 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow rounded-lg p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 line-clamp-3">
                    {ticket.description}
                  </p>
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    Created On: {new Date(ticket.date).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </Grid>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalTickets / ticketsPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPendingTickets;
