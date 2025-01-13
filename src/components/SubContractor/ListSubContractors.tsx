// src/components/SubContractor/ListSubContractors.tsx

import React, { useState } from 'react';
import {
  useFetchSubContractorsQuery,
  useDeleteSubContractorMutation,
} from '../../api/usersApi';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';
import Modal from '../Team/Modal';
import CreateSubContractor from './CreateSubContractor';
import EditSubContractor from './EditSubContractor';
import { ISubContractor } from '../../types/subContractor';
import { useToast } from '../../features/Toast/ToastContext';

const ListSubContractors: React.FC = () => {
  const { data: subcontractors, error, isLoading } = useFetchSubContractorsQuery();
  const [deleteSubContractor] = useDeleteSubContractorMutation();

  const { showToast } = useToast();

  // State for Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubContractor, setSelectedSubContractor] = useState<ISubContractor | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SubContractor?')) {
      try {
        await deleteSubContractor(id).unwrap();
        showToast('SubContractor deleted successfully.', 'success');
      } catch (err) {
        console.error('Failed to delete SubContractor:', err);
        showToast('Failed to delete SubContractor.', 'error');
      }
    }
  };

  const openEditModal = (sub: ISubContractor) => {
    setSelectedSubContractor(sub);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedSubContractor(null);
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
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
        <span className="ml-2 text-blue-600">Loading SubContractors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load SubContractors. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-gray-800 sidebar">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Teams</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Create SubContractor"
        >
          <FiUserPlus className="mr-2" /> Create SubContractor
        </button>
      </div>

      {/* SubContractors Table */}
      {subcontractors && subcontractors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className='text-left'>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Job Title</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcontractors.map(sub => (
                <tr key={sub._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    <Link to={`/dashboard/subcontractors/${sub._id}`} className="text-blue-600 hover:underline">
                      {sub.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{sub.email}</td>
                  <td className="py-2 px-4 border-b">{sub.phone_number || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{sub.job_title || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(sub)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        title="Edit SubContractor"
                        aria-label={`Edit ${sub.name}`}
                      >
                        <FiEdit size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Delete SubContractor"
                        aria-label={`Delete ${sub.name}`}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No SubContractors found.</p>
      )}

      {/* Create SubContractor Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create SubContractor"
      >
        <CreateSubContractor onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Edit SubContractor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit SubContractor"
      >
        {selectedSubContractor && (
          <EditSubContractor
            subContractor={selectedSubContractor}
            onClose={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ListSubContractors;
