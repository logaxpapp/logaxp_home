// src/components/FAQ/ListFaqs.tsx

import React, { useState } from 'react';
import {
  useListFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '../../api/faqApi';
import Button from './Button';
import Pagination from '../../components/common/Pagination/Pagination';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import { IFAQ } from '../../types/faq';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Ensure CSS is imported

export enum Application {
  DocSend = 'DocSend',
  TimeSync = 'TimeSync',
  TaskBrick = 'TaskBrick',
  Beautyhub = 'Beautyhub',
  BookMiz = 'BookMiz',
  GatherPlux = 'GatherPlux',
}

const ListFaqs: React.FC = () => {
  const { showToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQ, setSelectedFAQ] = useState<IFAQ | null>(null);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const pageSize = 5;

  // RTK Query hooks
  const { data, isLoading, error } = useListFAQsQuery({ page: currentPage, limit: pageSize });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const faqs = data?.data || [];
  const totalItems = data?.total || 0;

  // Calculate totalPages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handlers
  const openCreateModal = () => {
    setSelectedFAQ(null);
    setIsCreateEditModalOpen(true);
  };

  const openEditModal = (faq: IFAQ) => {
    setSelectedFAQ(faq);
    setIsCreateEditModalOpen(true);
  };

  const openDeleteModal = (faq: IFAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteModalOpen(true);
  };

  const handleSaveFAQ = async (formData: Partial<IFAQ>) => {
    try {
      if (selectedFAQ) {
        await updateFAQ({ id: selectedFAQ._id, data: formData }).unwrap();
        showToast('FAQ updated successfully!', 'success');
      } else {
        await createFAQ(formData).unwrap();
        showToast('FAQ created successfully!', 'success');
      }
      setIsCreateEditModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save FAQ:', err);
      const errorMessage = err?.data?.message || 'Failed to save FAQ. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteFAQ = async () => {
    if (selectedFAQ) {
      try {
        await deleteFAQ(selectedFAQ._id).unwrap();
        setIsDeleteModalOpen(false);
        showToast('FAQ deleted successfully!', 'success');
      } catch (err: any) {
        console.error('Failed to delete FAQ:', err);
        const errorMessage = err?.data?.message || 'Failed to delete FAQ. Please try again.';
        showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">FAQs</h1>
        <Button onClick={openCreateModal} leftIcon={<FaPlus />} variant="primary">
          Add FAQ
        </Button>
      </div>

      {/* FAQ Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Question</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Application</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Loading State */}
            {isLoading ? (
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700" colSpan={3}>
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Loading FAQs...
                  </div>
                </td>
              </tr>
            ) : error ? (
              /* Error State */
              <tr>
                <td className="px-4 py-2 text-sm text-red-500" colSpan={3}>
                  Error loading FAQs. Please try again later.
                </td>
              </tr>
            ) : faqs.length > 0 ? (
              /* Display FAQs */
              faqs.map((faq) => (
                <tr key={faq._id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <Link
                      to={`/dashboard/faqs/${faq._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {faq.question}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{faq.application}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end space-x-2">
                      {/* Edit Button */}
                      <Button
                        variant="primary"
                        iconOnly
                        onClick={() => openEditModal(faq)}
                        data-tooltip-id={`edit-tooltip-${faq._id}`}
                        data-tooltip-content="Edit FAQ"
                        aria-label="Edit FAQ"
                      >
                        <FaEdit />
                      </Button>
                      <Tooltip id={`edit-tooltip-${faq._id}`} place="top" />

                      {/* Delete Button */}
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => openDeleteModal(faq)}
                        data-tooltip-id={`delete-tooltip-${faq._id}`}
                        data-tooltip-content="Delete FAQ"
                        aria-label="Delete FAQ"
                      >
                        <FaTrash />
                      </Button>
                      <Tooltip id={`delete-tooltip-${faq._id}`} place="top" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* Empty List State */
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700" colSpan={3}>
                  No FAQs found. Click "Add FAQ" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {isCreateEditModalOpen && (
        <Modal
          isOpen={isCreateEditModalOpen}
          onClose={() => setIsCreateEditModalOpen(false)}
          title={selectedFAQ ? 'Edit FAQ' : 'Create FAQ'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                question: (e.target as any).question.value.trim(),
                answer: (e.target as any).answer.value.trim(),
                application: (e.target as any).application.value.trim(),
                // Optionally, add createdBy or updatedBy fields here
              };
              handleSaveFAQ(formData);
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Question</label>
                <input
                  name="question"
                  defaultValue={selectedFAQ?.question || ''}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Answer</label>
                <textarea
                  name="answer"
                  defaultValue={selectedFAQ?.answer || ''}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Application</label>
                <select
                  name="application"
                  defaultValue={selectedFAQ?.application || ''}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="" disabled>
                    Select Application
                  </option>
                  {Object.values(Application).map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={() => setIsCreateEditModalOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteFAQ}
          title="Confirm Deletion"
          message="Are you sure you want to delete this FAQ? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ListFaqs;
