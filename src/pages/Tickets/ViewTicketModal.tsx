// src/components/Ticket/Modals/ViewTicketModal.tsx
import React from 'react';
import Modal from '../../components/common/Feedback/Modal';
import { ITicket } from '../../types/ticket';
import Tag from './Tag';

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ITicket | null;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!ticket) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details">
      <div className="space-y-8 p-6 bg-white rounded-lg shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">{ticket.title}</h2>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>

        {/* Ticket Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Priority:</strong>{' '}
              <span className="capitalize font-medium">{ticket.priority || 'N/A'}</span>
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {ticket.category || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>Application:</strong> {ticket.application || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>Department:</strong> {ticket.department || 'N/A'}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Assigned To:</strong>{' '}
              {ticket.assignedTo ? (
                <span className="inline-flex items-center gap-2 font-medium">
                  {ticket.assignedTo.name || ticket.assignedTo.email}
                </span>
              ) : (
                'Unassigned'
              )}
            </p>
            <p className="text-gray-700">
              <strong>Created Date:</strong>{' '}
              {ticket.date
                ? new Date(ticket.date).toLocaleString()
                : 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>Due Date:</strong>{' '}
              {ticket.dueDate
                ? new Date(ticket.dueDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {ticket.tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Description</h3>
          <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <p className="text-gray-600">{ticket.description || 'No description available.'}</p>
          </div>
        </div>

        {/* Comments Section */}
        {ticket.comments && ticket.comments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
            <div className="mt-4 space-y-4">
              {ticket.comments.map((comment, index) => (
                <div key={index} className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 border-t pt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          {/* Add additional actions if needed */}
        </div>
      </div>
    </Modal>
  );
};

export default ViewTicketModal;
