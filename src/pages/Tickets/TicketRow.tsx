// src/components/Ticket/TicketRow.tsx

import React from 'react';
import { ITicket } from '../../types/ticket';
import ActionMenu from './ActionMenu';
import { FaPen } from 'react-icons/fa';

interface TicketRowProps {
  ticket: ITicket;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onView: () => void;
  onStatusChange: () => void;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  onEdit,
  onDelete,
  onAssign,
  onView,
  onStatusChange,
}) => {
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

  const handleRowClick = () => {
    onView();
  };

  const handleStatusChangeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering onView when clicking the status pen
    onStatusChange();
  };

  const handleActionMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent triggering onView when clicking action menu
  };

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleRowClick}>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
        {ticket.title}
      </td>
      <td className="px-4 py-4 whitespace-nowrap flex items-center">
        <span
          className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeClasses(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>
        <button
          onClick={handleStatusChangeClick}
          className="ml-2 flex items-center px-1 py-1 bg-gray-100 text-gray-700 rounded-full shadow hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
          aria-label={`Change status for ticket ${ticket.title}`}
        >
          <FaPen className="text-xs" />
        </button>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm">
        {ticket.priority}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm">
        {new Date(ticket.date).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div onClick={handleActionMenuClick}>
          <ActionMenu onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
        </div>
      </td>
    </tr>
  );
};

export default TicketRow;
