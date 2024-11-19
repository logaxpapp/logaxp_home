// src/components/CreateAppraisalMetric.tsx

import React, { useState, useEffect } from 'react';
import {  useFetchAppraisalQuestionsQuery } from '../../api/appraisalQuestionApi';
import  { useCreateAppraisalMetricMutation } from '../../api/appraisalMetricApi';
import { IAppraisalMetric } from '../../types/AppraisalMetric';
import MultiSelect, { OptionType } from '../common/Input/SelectDropdown/MultiSelect';

interface CreateAppraisalMetricProps {
  onSuccess: () => void;
}

const CreateAppraisalMetric: React.FC<CreateAppraisalMetricProps> = ({ onSuccess }) => {
  // Mutation hook for creating appraisal metrics
  const [createAppraisalMetric, { isLoading, error }] = useCreateAppraisalMetricMutation();

  // Fetch appraisal questions
  const { data: questions, isLoading: isQuestionsLoading, error: questionsError } = useFetchAppraisalQuestionsQuery();

  // Transform questions into options for MultiSelect
  const [questionOptions, setQuestionOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (questions) {
      const options = questions.map((question) => ({
        value: question._id,
        label: question.question_text, // Assuming `question_text` is the field
      }));
      setQuestionOptions(options);
    }
  }, [questions]);

  // Form state
  const [formData, setFormData] = useState<{
    metric_name: string;
    description: string;
    scale: number | '';
    associated_questions: string[];
  }>({
    metric_name: '',
    description: '',
    scale: '',
    associated_questions: [],
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'scale' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  // Handle associated questions change
  const handleAssociatedQuestionsChange = (selectedValues: string[] | null) => {
    setFormData((prevData) => ({
      ...prevData,
      associated_questions: selectedValues || [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<IAppraisalMetric> = {
        metric_name: formData.metric_name,
        description: formData.description,
        scale: formData.scale === '' ? undefined : formData.scale,
        associated_questions: formData.associated_questions,
      };
      await createAppraisalMetric(payload).unwrap();
      alert('Appraisal Metric Created Successfully!');
      // Reset form
      setFormData({
        metric_name: '',
        description: '',
        scale: '',
        associated_questions: [],
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to create appraisal metric:', err);
    }
  };

  return (
    <div className="container mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Create Appraisal Metric</h2>
      <form onSubmit={handleSubmit}>
        {/* Metric Name */}
        <div className="mb-6">
          <label htmlFor="metric_name" className="block text-gray-700 dark:text-gray-300 mb-2">
            Metric Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="metric_name"
            name="metric_name"
            value={formData.metric_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Enter metric name"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Enter detailed description"
          ></textarea>
        </div>

        {/* Scale */}
        <div className="mb-6">
          <label htmlFor="scale" className="block text-gray-700 dark:text-gray-300 mb-2">
            Scale (Optional)
          </label>
          <input
            type="number"
            id="scale"
            name="scale"
            value={formData.scale}
            onChange={handleChange}
            min={1}
            max={10}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Enter scale (e.g., 1-5)"
          />
        </div>

        {/* Associated Questions */}
        <div className="mb-6">
          <label htmlFor="associated_questions" className="block text-gray-700 dark:text-gray-300 mb-2">
            Associated Questions<span className="text-red-500">*</span>
          </label>
          {isQuestionsLoading ? (
            <div className="text-gray-500">Loading questions...</div>
          ) : questionsError ? (
            <div className="text-red-500">Error loading questions.</div>
          ) : (
            <MultiSelect
              label=""
              options={questionOptions}
              value={formData.associated_questions}
              onChange={handleAssociatedQuestionsChange}
              placeholder="Select associated questions"
              
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Metric'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500">
            Error creating metric. Please check the inputs and try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateAppraisalMetric;
