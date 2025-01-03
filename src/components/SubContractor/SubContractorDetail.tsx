// src/components/SubContractor/SubContractorDetail.tsx

import React from 'react';
import { useFetchSubContractorByIdQuery } from '../../api/usersApi';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import Modal from '../Team/Modal';
import EditSubContractor from './EditSubContractor';
import { ISubContractor } from '../../types/subContractor';
import { useDeleteSubContractorMutation } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';

const SubContractorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sub, error, isLoading } = useFetchSubContractorByIdQuery(id!);
  const [deleteSubContractor] = useDeleteSubContractorMutation();
  const { showToast } = useToast();

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SubContractor?')) {
      try {
        await deleteSubContractor(id).unwrap();
        showToast('SubContractor deleted successfully.');
        // Optionally, redirect to the SubContractors list
      } catch (err) {
        console.error('Failed to delete SubContractor:', err);
        showToast('Failed to delete SubContractor.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-blue-600">Loading SubContractor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load SubContractor details. Please try again later.
      </div>
    );
  }

  if (!sub) {
    return <div className="text-gray-600 text-center">SubContractor not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Link */}
      <Link to="/subcontractors" className="flex items-center text-blue-600 hover:underline mb-4">
        <FiArrowLeft className="mr-2" /> Back to SubContractors
      </Link>

      {/* SubContractor Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{sub.name}</h2>
          <div className="flex space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
              title="Edit SubContractor"
              aria-label="Edit SubContractor"
            >
              <FiEdit size={20} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(sub._id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              title="Delete SubContractor"
              aria-label="Delete SubContractor"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Email:</strong> {sub.email}
          </p>
          <p className="text-gray-700">
            <strong>Job Title:</strong> {sub.job_title || 'N/A'}
          </p>
          <p className="text-gray-700">
            <strong>Phone Number:</strong> {sub.phone_number || 'N/A'}
          </p>
          {/* Add other fields as necessary */}
        </div>
      </div>

      {/* Edit SubContractor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit SubContractor"
      >
        {sub && <EditSubContractor subContractor={sub} onClose={() => setIsEditModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default SubContractorDetail;
