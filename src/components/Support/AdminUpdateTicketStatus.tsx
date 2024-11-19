import React, { useState } from 'react';
import { ISupportTicket } from '../../types/support';
import { usePatchTicketStatusByAdminMutation } from '../../api/supportApiSlice';

interface AdminUpdateTicketStatusProps {
  ticket: ISupportTicket;
  onClose: () => void;
  onUpdate: () => void;
}

const AdminUpdateTicketStatus: React.FC<AdminUpdateTicketStatusProps> = ({ ticket, onClose, onUpdate }) => {
  const [status, setStatus] = useState(ticket.status);
  const [updateStatus, { isLoading }] = usePatchTicketStatusByAdminMutation();

  const handleSave = async () => {
    try {
      await updateStatus({ ticketId: ticket._id, status }).unwrap();
      alert('Ticket status updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-1/3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Update Ticket Status</h3>
        <div className="mt-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ISupportTicket['status'])}
            className="w-full mt-2 p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateTicketStatus;
