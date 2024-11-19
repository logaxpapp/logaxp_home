// src/components/ViewAppraisalQuestion.tsx

import React from 'react';
import { useFetchAppraisalQuestionByIdQuery } from '../../api/appraisalQuestionApi';
import Button from '../common/Button/Button';
import { FaArrowLeft } from 'react-icons/fa';

interface ViewAppraisalQuestionProps {
  questionId: string;
  onBack: () => void;
}

const ViewAppraisalQuestion: React.FC<ViewAppraisalQuestionProps> = ({ questionId, onBack }) => {
  const { data: question, error, isLoading } = useFetchAppraisalQuestionByIdQuery(questionId);

  if (isLoading) return <p>Loading appraisal question...</p>;
  if (error) return <p>Error loading appraisal question.</p>;
  if (!question) return <p>Appraisal question not found.</p>;

  return (
    <div>
      <Button
        variant="secondary"
        size="small"
        onClick={onBack}
        leftIcon={<FaArrowLeft />}
        className="mb-4"
      >
        Back to List
      </Button>
      <div className="border p-4 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-2">{question.question_text}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Type:</strong> {question.question_type}
        </p>
        {question.question_type === 'Multiple Choice' && question.options && (
          <div className="mt-2">
            <strong>Options:</strong>
            <ul className="list-disc list-inside">
              {question.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          <strong>Appraisal Type:</strong> {question.appraisal_type || 'N/A'}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Period:</strong> {question.period || 'N/A'}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
          <strong>Created At:</strong> {new Date(question.created_at).toLocaleString()}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          <strong>Updated At:</strong> {new Date(question.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ViewAppraisalQuestion;
