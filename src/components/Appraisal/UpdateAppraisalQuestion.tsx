// src/components/Appraisal/UpdateAppraisalQuestion.tsx

import React, { useState, useEffect } from 'react';
import { useUpdateAppraisalQuestionMutation, useFetchAppraisalQuestionByIdQuery } from '../../api/appraisalQuestionApi';
import { IAppraisalQuestion, QuestionType } from '../../types/appraisalQuestion';
import Button from '../common/Button/Button';
import { FaSave, FaPlus } from 'react-icons/fa';

interface UpdateAppraisalQuestionProps {
  questionId: string;
  onSuccess: () => void;
}

const UpdateAppraisalQuestion: React.FC<UpdateAppraisalQuestionProps> = ({ questionId, onSuccess }) => {
  const { data: question, error, isLoading } = useFetchAppraisalQuestionByIdQuery(questionId);
  const [updateAppraisalQuestion, { isLoading: isUpdating, error: updateError }] = useUpdateAppraisalQuestionMutation();

  const [formData, setFormData] = useState<Partial<IAppraisalQuestion>>({
    question_text: '',
    question_type: 'Rating',
    options: [''],
    appraisal_type: '',
    period: '',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options || [''],
        appraisal_type: question.appraisal_type,
        period: question.period,
      });
    }
  }, [question]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload
    const payload: Partial<IAppraisalQuestion> = {
      question_text: formData.question_text,
      question_type: formData.question_type as QuestionType,
      appraisal_type: formData.appraisal_type,
      period: formData.period,
    };

    if (formData.question_type === 'Multiple Choice') {
      payload.options = (formData.options || []).filter((opt) => opt.trim() !== '');
      if (payload.options.length < 2) {
        alert('Multiple Choice questions require at least two options.');
        return;
      }
    } else {
      payload.options = undefined; // Remove options if not Multiple Choice
    }

    try {
      await updateAppraisalQuestion({ id: questionId, updates: payload }).unwrap();
      alert('Appraisal question updated successfully!');
      onSuccess();
    } catch (err) {
      console.error('Failed to update appraisal question:', err);
      alert('Failed to update appraisal question.');
    }
  };

  if (isLoading) return <p>Loading appraisal question...</p>;
  if (error) return <p>Error loading appraisal question.</p>;
  if (!question) return <p>Appraisal question not found.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Update Appraisal Question</h2>

      <div>
        <label className="block text-gray-700">Question Text</label>
        <input
          type="text"
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter the question text"
        />
      </div>

      <div>
        <label className="block text-gray-700">Question Type</label>
        <select
          name="question_type"
          value={formData.question_type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="Rating">Rating</option>
          <option value="Text">Text</option>
          <option value="Multiple Choice">Multiple Choice</option>
        </select>
      </div>

      {formData.question_type === 'Multiple Choice' && (
        <div>
          <label className="block text-gray-700">Options</label>
          {formData.options?.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={addOption}
            className="mt-2"
            leftIcon={<FaPlus />}
          >
            Add Another Option
          </Button>
        </div>
      )}

      <div>
        <label className="block text-gray-700">Appraisal Type</label>
        <input
          type="text"
          name="appraisal_type"
          value={formData.appraisal_type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="e.g., Annual, Mid-Year"
        />
      </div>

      <div>
        <label className="block text-gray-700">Period</label>
        <input
          type="text"
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="e.g., Q1, Q2"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        isLoading={isUpdating}
        leftIcon={<FaSave />}
      >
        {isUpdating ? 'Updating...' : 'Update Question'}
      </Button>

      {updateError && <p className="text-red-500">Error updating question.</p>}
    </form>
  );
};

export default UpdateAppraisalQuestion;
