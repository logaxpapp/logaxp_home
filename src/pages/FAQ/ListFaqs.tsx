import React, { useState } from 'react';
import { useListFAQsQuery, useCreateFAQMutation, useUpdateFAQMutation, useDeleteFAQMutation } from '../../api/faqApi';
import Button from '../../components/common/Button/Button';
import Pagination from '../../components/common/Pagination/Pagination';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import { IFAQ } from '../../types/faq';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const ListFaqs: React.FC = () => {
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
    if (selectedFAQ) {
      await updateFAQ({ id: selectedFAQ._id, data: formData });
    } else {
      await createFAQ(formData);
    }
    setIsCreateEditModalOpen(false);
  };

  const handleDeleteFAQ = async () => {
    if (selectedFAQ) {
      await deleteFAQ(selectedFAQ._id);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <div>Loading FAQs...</div>;
  if (error) return <div>Error loading FAQs</div>;

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
            {faqs.map((faq) => (
              <tr key={faq._id}>
                <td className="px-4 py-2 text-sm text-gray-700">{faq.question}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{faq.application}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button
                    variant="primary"
                    leftIcon={<FaEdit />}
                    onClick={() => openEditModal(faq)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    leftIcon={<FaTrash />}
                    onClick={() => openDeleteModal(faq)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end">
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

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
                question: (e.target as any).question.value,
                answer: (e.target as any).answer.value,
                application: (e.target as any).application.value,
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
                <input
                  name="application"
                  defaultValue={selectedFAQ?.application || ''}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  required
                />
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
