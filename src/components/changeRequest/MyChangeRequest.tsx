import React, { useState } from 'react';
import {
  useFetchUserChangeRequestsQuery,
  useSoftDeleteChangeRequestMutation,
} from '../../api/changeRequestApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../features/Toast/ToastContext';
import ConfirmModal from './ConfirmModal';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Loader from '../Loader';

const MyChangeRequests: React.FC = () => {
  const { data: response, error, isLoading, refetch } = useFetchUserChangeRequestsQuery();
  const [deleteChangeRequest] = useSoftDeleteChangeRequestMutation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequestId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (reason: string) => {
    if (!selectedRequestId) return;

    try {
      await deleteChangeRequest({ id: selectedRequestId, reason }).unwrap();
      showToast('Change request deleted successfully.', 'success');
      closeModal();
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete change request.', 'error');
    }
  };

  const handleDetails = (id: string) => {
    navigate(`/dashboard/change-request-details/${id}`);
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.error('Error fetching change requests:', error);
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 font-medium">Failed to load your change requests.</p>
      </div>
    );
  }

  const changeRequests = response?.data || [];

  return (
    <div className="max-w-8xl mx-auto p-4 mt-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">My Change Requests</h2>
      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={() => navigate('/dashboard/create-change-request')}
      >
        <FaPlus className="inline mr-2" />
        Create Change Request
      </button>
      {changeRequests.length === 0 ? (
        <p className="text-gray-500">No change requests found. You can create one above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Fields to Change</th>
                <th className="py-3 px-6 text-left">Requested At</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {changeRequests.map((request: any, index: number) => (
                <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                  <td
                    className="py-3 px-6 text-gray-600 text-sm capitalize cursor-pointer hover:underline"
                    onClick={() => handleDetails(request._id)}
                    >
                    {request.status}
                    </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => openModal(request._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Change Request"
        message="Please confirm your deletion by providing a reason."
      />
    </div>
  );
};

export default MyChangeRequests;
