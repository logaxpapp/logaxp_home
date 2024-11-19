import React, { useState } from 'react';
import {
  useFetchDeletionRequestsQuery,
  useApproveDeletionRequestMutation,
  useRejectDeletionRequestMutation,
} from '../../api/usersApi';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import Modal from '../../components/common/Feedback/Modal';
import { FaEllipsisV } from 'react-icons/fa';

const DeletionRequests: React.FC = () => {
  const { data, isLoading, error } = useFetchDeletionRequestsQuery();
  const [approveDeletionRequest] = useApproveDeletionRequestMutation();
  const [rejectDeletionRequest] = useRejectDeletionRequestMutation();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const openConfirmModal = (type: 'approve' | 'reject', request: any) => {
    setModalType(type);
    setSelectedRequest(request);
    setConfirmModalOpen(true);
  };

  const openViewModal = (request: any) => {
    setSelectedRequest(request);
    setViewModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setModalType(null);
    setSelectedRequest(null);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAction = async () => {
    if (!selectedRequest || !modalType) return;

    try {
      if (modalType === 'approve') {
        await approveDeletionRequest(selectedRequest._id).unwrap();
        alert('Request approved successfully.');
      } else if (modalType === 'reject') {
        await rejectDeletionRequest(selectedRequest._id).unwrap();
        alert('Request rejected successfully.');
      }
    } catch {
      alert(`Failed to ${modalType} request.`);
    } finally {
      closeConfirmModal();
    }
  };

  const toggleDropdown = (requestId: string) => {
    setDropdownOpen((prev) => (prev === requestId ? null : requestId));
  };

  if (isLoading) return <p>Loading deletion requests...</p>;
  if (error) return <p className="text-red-500">Failed to fetch deletion requests.</p>;

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h1 className="text-2xl font-semibold text-blue-700 font-primary dark:text-lemonGreen-light">Account Deletion Requests</h1>
      </div>
      {data?.length ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-left dark:bg-gray-700 dark:text-gray-50">
            <tr>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody className='dark:text-gray-50'>
            {data.map((request: any) => (
              <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 border">{request.name}</td>
                <td className="p-3 border">{request.email}</td>
                <td className="p-3 border break-words max-w-xs text-gray-700 dark:text-gray-50">
                  {request.deletionReason || 'No reason provided'}
                </td>
                <td className="p-3 border text-center relative">
                  <button
                    onClick={() => toggleDropdown(request._id)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200"
                  >
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen === request._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 shadow-lg rounded-md border ">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => openViewModal(request)}
                      >
                        View Details
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => openConfirmModal('approve', request)}
                      >
                        Approve
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => openConfirmModal('reject', request)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending deletion requests.</p>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleAction}
        title={
          modalType === 'approve'
            ? 'Confirm Approval'
            : modalType === 'reject'
            ? 'Confirm Rejection'
            : ''
        }
        message={`Are you sure you want to ${
          modalType === 'approve' ? 'approve' : 'reject'
        } this deletion request?`}
      />

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={closeViewModal} title="Request Details">
        {selectedRequest && (
          <div className=" p-2">
            <div className=" ">
            <h2 className="text-lg font-bold mb-2 ">User Details</h2>
            </div>
            <p>
              <strong>Name:</strong> {selectedRequest.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Reason:</strong> {selectedRequest.deletionReason || 'No reason provided'}
            </p>
            <p>
              <strong>Applications Managed:</strong>{' '}
              {selectedRequest.applications_managed.join(', ') || 'None'}
            </p>
            <p>
              <strong>Employee ID:</strong> {selectedRequest.employee_id}
            </p>
            <p>
              <strong>Last Login:</strong>{' '}
              {new Date(selectedRequest.lastLoginAt).toLocaleString()}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(selectedRequest.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeletionRequests;
