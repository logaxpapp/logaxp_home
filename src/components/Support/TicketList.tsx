import React from 'react';
import { useFetchUserTicketsQuery } from '../../api/supportApiSlice';
import { ISupportTicket } from '../../types/support';

const TicketList: React.FC = () => {
  const { data: tickets, isLoading, error } = useFetchUserTicketsQuery();

  if (isLoading) return <p>Loading tickets...</p>;
  if (error) return <p>Error loading tickets.</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">My Support Tickets</h3>
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        {!tickets || tickets.length === 0 ? (
          <p className="text-center p-4 text-gray-600 dark:text-gray-400">No tickets available.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="p-4">Ticket Number</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: ISupportTicket) => (
                <tr
                  key={ticket._id}
                  className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                 <td className="p-4">
                    <a href={`/dashboard/support-tickets/${ticket._id}`} className="text-blue-500 hover:underline">
                        {ticket.ticketNumber || ticket._id}
                    </a>
                    </td>
                  <td className="p-4">{ticket.subject}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Helper function for ticket status styling
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-700';
    case 'Resolved':
      return 'bg-blue-100 text-blue-700';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'Closed':
      return 'bg-gray-100 text-gray-700';
    default:
      return '';
  }
};

export default TicketList;
