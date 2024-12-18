// src/components/Admin/AdminSupportDashboard.tsx

import React, { useState } from 'react';
import {
  useFetchUserTicketsQuery,
  useFetchAllFAQsQuery,
  useDeleteTicketMutation,
  useDeleteFAQMutation,
} from '../../api/supportApiSlice';
import { ISupportTicket, IFAQ } from '../../types/support';
import ConfirmationModal from '../common/Modal/ConfirmationModal';
import AdminUpdateTicketStatus from './AdminUpdateTicketStatus';
import NewTicketForm from './NewTicketForm';
import CreateUpdateFaqsForm from './CreateUpdateFaqsForm';
import UpdateTicketDetails from './UpdateTicketDetails';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import ActionDropdown from './ActionDropdown';
import Button from '../common/Button/Button';

const AdminSupportDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'tickets' | 'faqs'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState<ISupportTicket | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<IFAQ | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; type: 'Ticket' | 'FAQ' } | null>(null);
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [isFAQFormOpen, setIsFAQFormOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // API Hooks
  const { data: tickets, refetch: refetchTickets, isFetching: isFetchingTickets } = useFetchUserTicketsQuery();
  const { data: faqs, refetch: refetchFAQs, isFetching: isFetchingFAQs } = useFetchAllFAQsQuery();
  const [deleteTicket, { isLoading: isDeletingTicket }] = useDeleteTicketMutation();
  const [deleteFAQ, { isLoading: isDeletingFAQ }] = useDeleteFAQMutation();

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      if (deleteModal.type === 'Ticket') {
        await deleteTicket(deleteModal.id).unwrap();
        refetchTickets();
      } else if (deleteModal.type === 'FAQ') {
        await deleteFAQ(deleteModal.id).unwrap();
        refetchFAQs();
      }
      setNotification({ type: 'success', message: `${deleteModal.type} deleted successfully.` });
    } catch (error: any) {
      setNotification({ type: 'error', message: `Failed to delete ${deleteModal.type.toLowerCase()}.` });
      console.error(`Error deleting ${deleteModal.type}:`, error);
    } finally {
      setDeleteModal(null);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg font-secondary">
      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {notification.message}
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={!!deleteModal}
        title={`Delete ${deleteModal?.type}`}
        message={`Are you sure you want to delete this ${deleteModal?.type.toLowerCase()}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />
      {selectedTicket && (
        <UpdateTicketDetails
          ticket={selectedTicket}
          onUpdate={() => {
            refetchTickets();
            setSelectedTicket(null);
            setNotification({ type: 'success', message: 'Ticket details updated successfully.' });
          }}
          onCancel={() => setSelectedTicket(null)}
        />
      )}
      {selectedTicketStatus && (
        <AdminUpdateTicketStatus
          ticket={selectedTicketStatus}
          onUpdate={() => {
            refetchTickets();
            setSelectedTicketStatus(null);
            setNotification({ type: 'success', message: 'Ticket status updated successfully.' });
          }}
          onClose={() => setSelectedTicketStatus(null)}
        />
      )}
      {isTicketFormOpen && (
        <NewTicketForm
          onSuccess={() => {
            refetchTickets();
            setIsTicketFormOpen(false);
            setNotification({ type: 'success', message: 'Ticket created successfully.' });
          }}
          onCancel={() => setIsTicketFormOpen(false)}
        />
      )}
      {isFAQFormOpen && (
        <CreateUpdateFaqsForm
          faqToEdit={selectedFAQ}
          onSave={() => {
            refetchFAQs();
            setIsFAQFormOpen(false);
            setNotification({ type: 'success', message: 'FAQ saved successfully.' });
          }}
          onCancel={() => setIsFAQFormOpen(false)}
        />
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Button
            onClick={() => setSelectedTab('tickets')}
            className={`px-4 py-2 rounded-md ${
              selectedTab === 'tickets'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-200 text-gray-700'
            }`}
          >
            Tickets
          </Button>
          <Button
            onClick={() => setSelectedTab('faqs')}
            className={`px-4 py-2 rounded-md ${
              selectedTab === 'faqs'
                ? 'bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white'
                : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-200 text-gray-700'
            }`}
          >
            FAQs
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="mt-8">
        {selectedTab === 'tickets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Manage Tickets</h3>
              <Button
                onClick={() => setIsTicketFormOpen(true)}
                className="flex items-center px-4 py-2 bg-lemonGreen-light text-white rounded-md hover:bg-lemonGreen-dark transition-colors"
              >
                <FaPlus className="mr-2" />
                New Ticket
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-4 text-left">Ticket ID</th>
                    <th className="p-4 text-left">Subject</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingTickets ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">
                        <FaSpinner className="animate-spin text-2xl text-gray-500" />
                      </td>
                    </tr>
                  ) : tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="p-4">
                          <a
                            href={`/dashboard/support-tickets/${ticket._id}`}
                            className="text-blue-500 hover:underline font-semibold"
                          >
                            {ticket.ticketNumber || ticket._id}
                          </a>
                        </td>
                        <td className="p-4">{ticket.subject}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-sm font-medium rounded-full ${
                              ticket.status === 'Open'
                                ? 'bg-green-100 text-green-800'
                                : ticket.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <ActionDropdown
                            actions={[
                              {
                                label: 'Update Details',
                                icon: <FaSpinner className="mr-2" />,
                                onClick: () => setSelectedTicket(ticket),
                              },
                              {
                                label: 'Change Status',
                                icon: <FaSpinner className="mr-2" />,
                                onClick: () => setSelectedTicketStatus(ticket),
                              },
                              {
                                label: 'Delete Ticket',
                                icon: <FaSpinner className="mr-2" />,
                                onClick: () => setDeleteModal({ id: ticket._id, type: 'Ticket' }),
                                isDanger: true,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'faqs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Manage FAQs</h3>
              <Button
                onClick={() => {
                  setSelectedFAQ(null);
                  setIsFAQFormOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-lemonGreen-light text-white rounded-md hover:bg-lemonGreen-dark transition-colors"
              >
                <FaPlus className="mr-2" />
                New FAQ
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-4 text-left">Question</th>
                    <th className="p-4 text-left">Answer</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingFAQs ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center">
                        <FaSpinner className="animate-spin text-2xl text-gray-500" />
                      </td>
                    </tr>
                  ) : faqs && faqs.length > 0 ? (
                    faqs.map((faq) => (
                      <tr
                        key={faq._id}
                        className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="p-4">{faq.question}</td>
                        <td className="p-4">{faq.answer}</td>
                        <td className="p-4">
                          <ActionDropdown
                            actions={[
                              {
                                label: 'Update FAQ',
                                icon: <FaSpinner className="mr-2" />,
                                onClick: () => {
                                  setSelectedFAQ(faq);
                                  setIsFAQFormOpen(true);
                                },
                              },
                              {
                                label: 'Delete FAQ',
                                icon: <FaSpinner className="mr-2" />,
                                onClick: () => setDeleteModal({ id: faq._id, type: 'FAQ' }),
                                isDanger: true,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No FAQs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportDashboard;
