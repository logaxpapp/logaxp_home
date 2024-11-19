import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSurveyAssignmentQuery, useSubmitSurveyResponsesMutation } from '../../api/apiSlice';
import Loader from '../../components/Loader';
import Button from '../../components/common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';
import { FaPen, FaFileAlt, FaRegQuestionCircle, FaClock } from 'react-icons/fa';

const SubmitSurveyResponses: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data: assignment, isLoading, error } = useGetSurveyAssignmentQuery(assignmentId || '');
  const [submitSurveyResponses, { isLoading: isSubmitting }] = useSubmitSurveyResponsesMutation();
  const [responses, setResponses] = useState<{ [key: string]: string | string[] | number }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const showToast = useToast().showToast;
  const navigate = useNavigate();

  const dueDate = assignment?.due_date ? new Date(assignment.due_date) : null;
  const today = new Date();
  const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const formattedDueDate = dueDate
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(dueDate)
    : 'N/A';

  const handleResponseChange = (questionId: string, value: string | string[] | number) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignment?._id) {
      setFormError("Invalid assignment. Please try again.");
      return;
    }

    try {
      await submitSurveyResponses({
        assignmentId: assignment._id,
        responses: Object.entries(responses).map(([questionId, answer]) => ({
          question_id: questionId,
          response_text: answer,
        })),
      }).unwrap();

      showToast("Survey responses submitted successfully!", "success");
      navigate("/dashboard/my-surveys");
    } catch (error) {
      showToast("Failed to submit survey responses. Please try again.", "error");
      setFormError("Failed to submit survey responses. Please try again.");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error loading survey.</p>;
  if (!assignment?.survey) return <p className="text-red-500 text-center">Survey details not available.</p>;

  return (
    <div className="mx-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-blue-800 flex items-center space-x-2">
          <FaFileAlt className="text-blue-600" />
          <span>{assignment.survey.title}</span>
        </h2>
        <div className="text-right">
          <p className="text-lg text-gray-500 italic">
            Due Date: <strong>{formattedDueDate}</strong>
          </p>
          {daysLeft !== null && daysLeft >= 0 ? (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <FaClock className="mr-1" />
              <span>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">No due date</p>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-8 border-l-4 border-blue-500 pl-4 italic">{assignment.survey.description}</p>

      <form onSubmit={handleSubmit} className="space-y-2">
        {assignment.survey.questions.map((question, idx) => (
          <div key={question._id || `fallback-${idx}`} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md text-sm">
            <label htmlFor={question._id || `fallback-${idx}`} className="flex items-center text-xl font-semibold text-gray-800 mb-2">
              <FaRegQuestionCircle className="text-blue-500 mr-2 text" />
              {question.question_text}
            </label>

            {/* Render input based on question type */}
            {question.question_type === 'Text' && (
              <textarea
                id={question._id || `fallback-${idx}`}
                value={responses[question._id || `fallback-${idx}`] || ''}
                onChange={(e) => handleResponseChange(question._id || `fallback-${idx}`, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                placeholder="Type your response here..."
                rows={2}
              />
            )}

            {question.question_type === 'Multiple Choice' && (
              <select
                id={question._id || `fallback-${idx}`}
                value={responses[question._id || `fallback-${idx}`] || ''}
                onChange={(e) => handleResponseChange(question._id || `fallback-${idx}`, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {question.options?.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.question_type === 'Checkbox' && (
              <div className="space-y-2">
                {question.options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={(responses[question._id || `fallback-${idx}`] as string[])?.includes(option)}
                      onChange={(e) => {
                        const currentAnswers = (responses[question._id || `fallback-${idx}`] as string[]) || [];
                        const updatedAnswers = e.target.checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter((a) => a !== option);
                        handleResponseChange(question._id || `fallback-${idx}`, updatedAnswers);
                      }}
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {question.question_type === 'Rating' && (
              <input
                type="number"
                min="1"
                max="5"
                id={question._id || `fallback-${idx}`}
                value={responses[question._id || `fallback-${idx}`] || ''}
                onChange={(e) => handleResponseChange(question._id || `fallback-${idx}`, Number(e.target.value))}
                className="w-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1-5"
              />
            )}
          </div>
        ))}

        {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <FaPen />
                <span>Submit Survey</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitSurveyResponses;
