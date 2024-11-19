import React, { useState } from 'react';
import { FaQuestionCircle, FaEdit, FaTrash } from 'react-icons/fa';
import {
  useFetchAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '../../api/supportApiSlice';
import Button from '../common/Button/Button';
import ConfirmationModal from '../common/Modal/ConfirmationModal';
import { IFAQ, IFAQInput } from '../../types/support';

const FAQsList: React.FC = () => {
  const { data: faqs, isLoading, error, refetch: refetchFAQs } = useFetchAllFAQsQuery();
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const [newFAQ, setNewFAQ] = useState<IFAQInput>({ question: '', answer: '' });
  const [editingFAQ, setEditingFAQ] = useState<IFAQ | null>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<IFAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await createFAQ(newFAQ).unwrap();
      alert('FAQ created successfully');
      setNewFAQ({ question: '', answer: '' });
      refetchFAQs();
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ || !editingFAQ._id) {
      alert('No FAQ selected for editing.');
      return;
    }
    try {
      await updateFAQ({ faqId: editingFAQ._id, question: newFAQ.question, answer: newFAQ.answer }).unwrap();
      alert('FAQ updated successfully');
      setEditingFAQ(null);
      setNewFAQ({ question: '', answer: '' });
      refetchFAQs();
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  const handleDeleteFAQ = async () => {
    if (!deletingFAQ || !deletingFAQ._id) {
      alert('No FAQ selected for deletion.');
      return;
    }
    try {
      await deleteFAQ(deletingFAQ._id).unwrap();
      alert('FAQ deleted successfully');
      setDeletingFAQ(null);
      setIsModalOpen(false);
      refetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleEditClick = (faq: IFAQ) => {
    setEditingFAQ(faq);
    setNewFAQ({ question: faq.question, answer: faq.answer });
  };

  const handleDeleteClick = (faq: IFAQ) => {
    setDeletingFAQ(faq);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Frequently Asked Questions
      </h3>

      {/* Create or Edit FAQ Form */}
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {editingFAQ ? 'Edit FAQ' : 'Create FAQ'}
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingFAQ ? handleUpdateFAQ() : handleCreateFAQ();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium">Question</label>
            <input
              type="text"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
              className="w-full mt-2 p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter FAQ question"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium">Answer</label>
            <textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              className="w-full mt-2 p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              rows={3}
              placeholder="Enter FAQ answer"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            {editingFAQ && (
              <button
                onClick={() => {
                  setEditingFAQ(null);
                  setNewFAQ({ question: '', answer: '' });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
              >
                Cancel
              </button>
            )}
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : editingFAQ ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p>Loading FAQs...</p>
        ) : error ? (
          <p>Error loading FAQs.</p>
        ) : (
          faqs?.map((faq) => (
            <details key={faq._id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <summary className="cursor-pointer text-lg font-medium text-gray-800 dark:text-gray-200 flex justify-between">
                <span>
                  <FaQuestionCircle className="inline-block mr-2 text-blue-500" />
                  {faq.question}
                </span>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEditClick(faq)}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(faq)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this FAQ: "${deletingFAQ?.question}"?`}
        onConfirm={handleDeleteFAQ}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FAQsList;
