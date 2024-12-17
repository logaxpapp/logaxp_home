// src/components/Ticket/TicketTable.tsx

import React from 'react';
import { ITicket } from '../../types/ticket';
import TicketRow from './TicketRow';

interface TicketTableProps {
  tickets: ITicket[];
  onEdit: (ticket: ITicket) => void;
  onDelete: (ticket: ITicket) => void;
  onAssign: (ticket: ITicket) => void;
  onView: (ticket: ITicket) => void;
  sortColumn: keyof ITicket;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof ITicket) => void;
  onStatusChange: (ticket: ITicket) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onEdit,
  onDelete,
  onAssign,
  onView,
  sortColumn,
  sortDirection,
  onSort,
  onStatusChange,
}) => {
  const renderSortIcon = (column: keyof ITicket) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow dark:bg-gray-700">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('title')}
            >
              Title {renderSortIcon('title')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('status')}
            >
              Stat {renderSortIcon('status')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('priority')}
            >
              Prio {renderSortIcon('priority')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('date')}
            >
              Created {renderSortIcon('date')}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Act.
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket._id}
              ticket={ticket}
              onEdit={() => onEdit(ticket)}
              onDelete={() => onDelete(ticket)}
              onAssign={() => onAssign(ticket)}
              onView={() => onView(ticket)}
              onStatusChange={() => onStatusChange(ticket)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
