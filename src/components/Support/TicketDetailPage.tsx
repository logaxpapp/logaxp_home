import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchSupportTicketByIdQuery } from '../../api/supportApiSlice';
import { FaSpinner, FaUser, FaTag, FaCalendarAlt, FaInfoCircle, FaExclamationCircle, FaArrowCircleLeft } from 'react-icons/fa';

const TicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data: ticket, isLoading, error } = useFetchSupportTicketByIdQuery(ticketId!, { skip: !ticketId });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-blue-500" size={30} />
        <p className="ml-3 text-gray-600 dark:text-gray-300">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400 text-lg">
          <FaExclamationCircle className="inline-block mr-2" />
          Failed to load ticket details. Please try again later.
        </p>
      </div>
    );
  }

  const handleReturnToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className=" mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          {/* Back Button */}
          <button
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-red-600 dark:bg-red-400 text-white hover:bg-red-500 dark:hover:bg-red-300"
            onClick={handleReturnToPreviousPage}
          >
            <FaArrowCircleLeft className="mr-2" />
            Return
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300">
            Ticket Details
          </h1>

          {/* Status Badge */}
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusClass(ticket.status)}`}
          >
            {ticket.status}
          </span>
        </div>

        {/* Sender Information */}
       {/* Sender Details */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-8 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-2">
                <FaUser className="mr-2" /> Sender Details
            </h2>
            {typeof ticket.userId === 'object' && ticket.userId !== null ? (
                <>
                <p className="text-gray-800 dark:text-gray-300">
                    <strong>Name:</strong> {ticket.userId.name}
                </p>
                <p className="text-gray-800 dark:text-gray-300">
                    <strong>Email:</strong> {ticket.userId.email}
                </p>
                </>
            ) : (
                <p className="text-gray-800 dark:text-gray-300">Unknown User</p>
            )}
            </div>
        {/* Ticket Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DetailCard
            icon={<FaInfoCircle />}
            label="Ticket Number"
            value={ticket.ticketNumber || ticket._id}
          />
          <DetailCard
            icon={<FaCalendarAlt />}
            label="Created At"
            value={new Date(ticket.createdAt).toLocaleString()}
          />
          <DetailCard
            icon={<FaCalendarAlt />}
            label="Updated At"
            value={new Date(ticket.updatedAt).toLocaleString()}
          />
          <DetailCard
            icon={<FaInfoCircle />}
            label="Priority"
            value={ticket.priority}
          />
          <DetailCard
            icon={<FaTag />}
            label="Tags"
            value={ticket.tags?.join(', ') || 'No tags'}
          />
          <DetailCard
            icon={<FaInfoCircle />}
            label="Subject"
            value={ticket.subject}
          />
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {ticket.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Displaying Details
const DetailCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
    <div className="text-blue-600 dark:text-blue-300 text-xl mr-4">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
        {label}
      </h3>
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  </div>
);

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

export default TicketDetailPage;
