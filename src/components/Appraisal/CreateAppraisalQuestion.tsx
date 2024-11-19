// src/components/Appraisal/CreateAppraisalQuestion.tsx

import React, { useState } from 'react';
import { useCreateAppraisalQuestionMutation } from '../../api/appraisalQuestionApi';
import { IAppraisalQuestion, QuestionType } from '../../types/appraisalQuestion';
import Button from '../common/Button/Button';
import { FaSave, FaPlus } from 'react-icons/fa';

interface CreateAppraisalQuestionProps {
  onSuccess: () => void;
}

const CreateAppraisalQuestion: React.FC<CreateAppraisalQuestionProps> = ({ onSuccess }) => {
  const [createAppraisalQuestion, { isLoading, error }] = useCreateAppraisalQuestionMutation();

  const [formData, setFormData] = useState<Partial<IAppraisalQuestion>>({
    question_text: '',
    question_type: 'Rating',
    options: [''],
    appraisal_type: '',
    period: '',
  });

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
    }

    try {
      await createAppraisalQuestion(payload).unwrap();
      alert('Appraisal question created successfully!');
      onSuccess();
    } catch (err) {
      console.error('Failed to create appraisal question:', err);
      alert('Failed to create appraisal question.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Appraisal Question</h2>

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
        isLoading={isLoading}
        leftIcon={<FaSave />}
      >
        {isLoading ? 'Creating...' : 'Create Question'}
      </Button>

      {error && <p className="text-red-500">Error creating question.</p>}
    </form>
  );
};

export default CreateAppraisalQuestion;
