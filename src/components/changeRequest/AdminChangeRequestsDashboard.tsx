import React, { useEffect, useState } from 'react';
import {
  useFetchAllChangeRequestsQuery,
  useApproveChangeRequestMutation,
  useRejectChangeRequestMutation,
  useDeleteChangeRequestMutation,
} from '../../api/changeRequestApi';
import { useToast } from '../../features/Toast/ToastContext';
import { FaEllipsisV } from 'react-icons/fa';
import ConfirmationModal from './ConfirmModal';
import Loader from '../Loader';

const AdminChangeRequestsDashboard: React.FC = () => {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { data: response, error, isLoading, refetch } = useFetchAllChangeRequestsQuery({ includeDeleted });
  const [approveChangeRequest] = useApproveChangeRequestMutation();
  const [rejectChangeRequest] = useRejectChangeRequestMutation();
  const [deleteChangeRequest] = useDeleteChangeRequestMutation();
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'delete' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  useEffect(() => {
    refetch();
  }, [includeDeleted, refetch]);

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openModal = (type: 'approve' | 'reject' | 'delete', id: string) => {
    setModalData({ isOpen: true, type, id });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, type: null, id: null });
  };

  const handleAction = async (reason: string) => {
    if (!modalData.type || !modalData.id) return;

    try {
      if (modalData.type === 'approve') {
        await approveChangeRequest({ id: modalData.id, payload: { comments: reason } }).unwrap();
        showToast('Change request approved.', 'success');
      } else if (modalData.type === 'reject') {
        await rejectChangeRequest({ id: modalData.id, payload: { comments: reason } }).unwrap();
        showToast('Change request rejected.', 'success');
      } else if (modalData.type === 'delete') {
        await deleteChangeRequest(modalData.id).unwrap();
        showToast('Change request deleted.', 'success');
      }
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Action failed.', 'error');
    } finally {
      closeModal();
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.error('Error fetching change requests:', error);
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 font-medium">Failed to load change requests.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={refetch}
        >
          Retry
        </button>
      </div>
    );
  }

  const changeRequests = response?.data || [];

  if (!changeRequests.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 font-medium">No pending change requests found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Pending Change Requests</h2>
        <button
          onClick={() => setIncludeDeleted((prev) => !prev)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          {includeDeleted ? 'Hide Deleted Requests' : 'Show Deleted Requests'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Fields to Change</th>
              <th className="py-3 px-6 text-left">Requested At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {changeRequests.map((request: any, index: number) => (
              <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-6">
                  <p className="font-medium text-gray-700">{request.user.name}</p>
                  <p className="text-sm text-gray-500">{request.user.email}</p>
                </td>
                <td className="py-3 px-6">
                  {Object.entries(request.request_data.fields_to_change).map(([field, value]) => (
                    <div key={field} className="text-sm">
                      <strong className="text-gray-600">{field}:</strong>{' '}
                      {value ? (typeof value === 'object' ? JSON.stringify(value) : value.toString()) : 'N/A'}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-6 text-gray-600 text-sm">
                  {new Date(request.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center relative">
                  <div className="inline-block text-left">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => toggleDropdown(request._id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {dropdownOpen[request._id] && (
                      <div className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                        <button
                          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-lemonGreen"
                          onClick={() => openModal('approve', request._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-amber-600"
                          onClick={() => openModal('reject', request._id)}
                        >
                          Reject
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
                          onClick={() => openModal('delete', request._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        onConfirm={handleAction}
        title={
          modalData.type === 'approve'
            ? 'Approve Change Request'
            : modalData.type === 'reject'
            ? 'Reject Change Request'
            : 'Delete Change Request'
        }
        message={`Are you sure you want to ${
          modalData.type === 'approve'
            ? 'approve'
            : modalData.type === 'reject'
            ? 'reject'
            : 'delete'
        } this change request? ${
          modalData.type === 'delete' ? 'Please provide a reason.' : ''
        }`}
      />
    </div>
  );
};

export default AdminChangeRequestsDashboard;
