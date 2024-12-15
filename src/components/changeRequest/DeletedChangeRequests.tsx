import React, { useState } from 'react';
import {
  useFetchSoftDeletedChangeRequestsQuery,
  useRestoreChangeRequestMutation,
  usePermanentlyDeleteChangeRequestMutation,
} from '../../api/changeRequestApi';
import Loader from '../Loader';
import ConfirmationModal from '../common/Feedback/ConfirmModal';
import { FaTrash, FaUndo } from 'react-icons/fa';

const DeletedChangeRequests: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: response, error, isLoading, refetch } = useFetchSoftDeletedChangeRequestsQuery({ page, limit });
  const [restoreChangeRequest] = useRestoreChangeRequestMutation();
  const [permanentlyDeleteChangeRequest] = usePermanentlyDeleteChangeRequestMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'restore' | 'delete' | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const openModal = (action: 'restore' | 'delete', id: string) => {
    setModalAction(action);
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalAction(null);
    setSelectedRequestId(null);
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    if (!selectedRequestId || !modalAction) return;

    try {
      if (modalAction === 'restore') {
        await restoreChangeRequest(selectedRequestId).unwrap();
        alert('Change request restored successfully.');
      } else if (modalAction === 'delete') {
        await permanentlyDeleteChangeRequest(selectedRequestId).unwrap();
        alert('Change request permanently deleted.');
      }
      closeModal();
      refetch();
    } catch (error) {
      console.error(`Failed to ${modalAction} change request:`, error);
      alert(`Failed to ${modalAction} change request.`);
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.error('Error fetching soft-deleted change requests:', error);
    return <p className="text-red-600">Failed to load deleted change requests.</p>;
  }

  const { data: deletedChangeRequests, totalCount, totalPages } = response || {};

  if (!deletedChangeRequests?.length) {
    return <p className="text-gray-500">No soft-deleted change requests found.</p>;
  }

  return (
    <div className="mt-1 mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Soft-Deleted Change Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Fields to Change</th>
              <th className="py-3 px-6 text-left">Deleted Reason</th>
              <th className="py-3 px-6 text-left">Deleted At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletedChangeRequests.map((request: any, index: number) => (
              <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-6">
                  <p className="font-medium text-gray-700">{request.user?.name}</p>
                  <p className="text-sm text-gray-500">{request.user?.email}</p>
                </td>
                <td className="py-3 px-6">
                  {Object.entries(request.request_data.fields_to_change).map(([field, value]) => (
                    <div key={field} className="text-sm">
                      <strong className="text-gray-600">{field}:</strong>{' '}
                      {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-6 text-gray-600 text-sm">{request.deletedReason}</td>
                <td className="py-3 px-6 text-gray-600 text-sm">
                  {new Date(request.deletedAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openModal('restore', request._id)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onClick={() => openModal('delete', request._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalAction === 'restore' ? 'Restore Change Request' : 'Permanently Delete Change Request'}
        message={
          modalAction === 'restore'
            ? 'Are you sure you want to restore this change request?'
            : 'Are you sure you want to permanently delete this change request? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default DeletedChangeRequests;
