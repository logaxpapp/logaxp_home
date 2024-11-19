import React, { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import { useCreateFAQMutation, useUpdateFAQMutation } from '../../api/supportApiSlice';
import { IFAQ, IFAQInput } from '../../types/support';

interface CreateUpdateFaqsFormProps {
  faqToEdit?: IFAQ | null; // Optional prop for editing an FAQ
  onSave: () => void; // Callback function to refresh data after save
  onCancel: () => void; // Callback function for canceling the operation
}

const CreateUpdateFaqsForm: React.FC<CreateUpdateFaqsFormProps> = ({
  faqToEdit,
  onSave,
  onCancel,
}) => {
  const [faqData, setFaqData] = useState<IFAQInput>({ question: '', answer: '' });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();

  // Populate form if editing an FAQ
  useEffect(() => {
    if (faqToEdit) {
      setFaqData({ question: faqToEdit.question, answer: faqToEdit.answer });
    }
  }, [faqToEdit]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqData.question || !faqData.answer) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      if (faqToEdit) {
        // Update existing FAQ
        await updateFAQ({ faqId: faqToEdit._id, question: faqData.question, answer: faqData.answer }).unwrap();
        alert('FAQ updated successfully');
      } else {
        // Create new FAQ
        await createFAQ(faqData).unwrap();
        alert('FAQ created successfully');
      }
      setFaqData({ question: '', answer: '' });
      onSave();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  return (
    <div className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md">
      <h4 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
        {faqToEdit ? 'Edit FAQ' : 'Create New FAQ'}
      </h4>
      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-700 dark:text-gray-300 font-medium text-lg">Question</label>
          <input
            type="text"
            value={faqData.question}
            onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
            className="w-full p-3 border rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your FAQ question here"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 dark:text-gray-300 font-medium text-lg">Answer</label>
          <textarea
            value={faqData.answer}
            onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
            className="w-full p-3 border rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            placeholder="Provide the answer for your FAQ"
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFaqData({ question: '', answer: '' });
              onCancel();
            }}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isCreating || isUpdating ? 'Saving...' : faqToEdit ? 'Update FAQ' : 'Create FAQ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateFaqsForm;
