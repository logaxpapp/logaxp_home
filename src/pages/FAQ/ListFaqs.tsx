// src/components/FAQ/ListFaqs.tsx

import React, { useState, Fragment } from 'react';
import {
  useListFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useUnpublishFAQMutation,
  usePublishFAQMutation,
} from '../../api/faqApi';
import Button from './Button';
import Pagination from '../../components/common/Pagination/Pagination';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import { IFAQ } from '../../types/applicationFAQS';
import { FaEdit, FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaEllipsisV } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';
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

  const pageSize = 20;

  // RTK Query hooks
  const { data, isLoading, error } = useListFAQsQuery({ page: currentPage, limit: pageSize });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();
  const [publishFAQ, { isLoading: isPublishing }] = usePublishFAQMutation();
  const [unpublishFAQ, { isLoading: isUnpublishing }] = useUnpublishFAQMutation();

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
      if (!Object.values(Application).includes(formData.application as Application)) {
        throw new Error(`Invalid application value: ${formData.application}`);
      }

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

  const handlePublishFAQ = async (faqId: string) => {
    try {
      await publishFAQ(faqId).unwrap();
      showToast('FAQ published successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to publish FAQ:', error);
      const errorMessage = error?.data?.message || 'Failed to publish FAQ. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const handleUnpublishFAQ = async (faqId: string) => {
    try {
      await unpublishFAQ(faqId).unwrap();
      showToast('FAQ unpublished successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to unpublish FAQ:', error);
      const errorMessage = error?.data?.message || 'Failed to unpublish FAQ. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto font-secondary dark:bg-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">FAQs</h1>
        <Button onClick={openCreateModal} leftIcon={<FaPlus />} variant="primary" className='bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900 '>
          Add FAQ
        </Button>
      </div>

      {/* FAQ Table */}
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 dark-bg-gray-700">
          <thead className="bg-gray-50  dark:bg-gray-700 text-gray-500 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium ">SN</th>
              <th className="px-4 py-2 text-left text-sm font-medium ">Question</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Application</th>
              <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700">
            {/* Loading State */}
            {isLoading ? (
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700" colSpan={4}>
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
                <td className="px-4 py-2 text-sm text-red-500" colSpan={4}>
                  Error loading FAQs. Please try again later.
                </td>
              </tr>
            ) : faqs.length > 0 ? (
              /* Display FAQs */
              faqs.map((faq, index) => (
                <tr key={faq._id}>
                  <td className="px-4 py-2 text-sm ">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <Link
                      to={`/dashboard/faqs/${faq._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {faq.question}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-sm ">{faq.application}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end">
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button
                            className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="Actions"
                            data-tooltip-id={`actions-tooltip-${faq._id}`}
                            data-tooltip-content="View Actions"
                          >
                            <FaEllipsisV />
                          </Menu.Button>
                          <Tooltip id={`actions-tooltip-${faq._id}`} place="top" />
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                            <div className="py-1">
                              {faq.published ? (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => handleUnpublishFAQ(faq._id)}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-red-500 font-semibold'
                                      } block w-full text-left px-4 py-2 text-sm`}
                                      disabled={isUnpublishing}
                                    >
                                      Unpublish
                                    </button>
                                  )}
                                </Menu.Item>
                              ) : (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => handlePublishFAQ(faq._id)}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-lemonGreen'
                                      } block w-full text-left px-4 py-2 text-sm`}
                                      disabled={isPublishing}
                                    >
                                      Publish
                                    </button>
                                  )}
                                </Menu.Item>
                              )}
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => openEditModal(faq)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => openDeleteModal(faq)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                    disabled={isDeleting}
                                  >
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* Empty List State */
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700" colSpan={4}>
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
