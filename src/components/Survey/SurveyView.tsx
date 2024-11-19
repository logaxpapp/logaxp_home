import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSurveyDetailsQuery, useSubmitSurveyResponsesMutation } from '../../api/surveyApi';
import Loader from '../../components/Loader';
import Button from '../../components/common/Button/Button';
import { IResponse } from '../../types/survey';
import { FiArrowLeft } from 'react-icons/fi';

const SurveyView: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { data: survey, error, isLoading } = useGetSurveyDetailsQuery(surveyId!);
  const [submitSurveyResponses] = useSubmitSurveyResponsesMutation();
  const [responses, setResponses] = useState<IResponse[]>([]);

  if (isLoading) return <Loader />;
  if (error || !survey) return <p className="text-red-500 text-center">Error loading survey details.</p>;

  const handleChange = (questionId: string, response_text: IResponse['response_text']) => {
    setResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      const index = updatedResponses.findIndex((res) => res.question_id === questionId);

      if (index !== -1) {
        updatedResponses[index].response_text = response_text;
      } else {
        updatedResponses.push({ question_id: questionId, response_text });
      }
      return updatedResponses;
    });
  };

  const handleSubmit = async () => {
    try {
      await submitSurveyResponses({
        assignmentId: surveyId!,
        responses,
      }).unwrap();
      alert('Survey responses submitted successfully!');
      navigate('/dashboard/my-surveys');
    } catch (err) {
      console.error('Error submitting survey:', err);
      alert('Failed to submit survey. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-t via-lime-200 to-emerald-300 to-cyan-300 shadow-sm z-10 p-4 flex items-center justify-between border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FiArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h2 className="text-2xl font-bold text-blue-800">Survey: {survey.title}</h2>
      </div>

      {/* Survey Details */}
      <div className="container mx-auto p-6">
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800">Survey Description</h3>
          <p className="text-gray-600 mt-2">{survey.description || 'No description available'}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {survey.questions.map((question) => (
            <div key={question._id} className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-800">{question.question_text}</p>

              {/* Render input based on question type */}
              {question.question_type === 'Text' && (
                <textarea
                  className="mt-3 w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your answer here..."
                  onChange={(e) => handleChange(question._id!, e.target.value)}
                />
              )}

              {question.question_type === 'Multiple Choice' && (
                <select
                  className="mt-3 w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange(question._id!, e.target.value)}
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
                <div className="mt-3 space-y-3">
                  {question.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                          const currentAnswers =
                            (responses.find((res) => res.question_id === question._id)?.response_text as string[]) || [];
                          const updatedAnswers = e.target.checked
                            ? [...currentAnswers, option]
                            : currentAnswers.filter((a) => a !== option);
                          handleChange(question._id!, updatedAnswers);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-gray-700">{option}</label>
                    </div>
                  ))}
                </div>
              )}

              {question.question_type === 'Rating' && (
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="mt-3 w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange(question._id!, parseInt(e.target.value))}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button variant="success" size="large" onClick={handleSubmit}>
            Submit Survey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyView;
