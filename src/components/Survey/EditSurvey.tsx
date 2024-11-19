import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSurveyDetailsQuery, useUpdateSurveyMutation } from '../../api/surveyApi';
import { IQuestion } from '../../types/survey';
import { FaPlus, FaCheck, FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Button from '../../components/common/Button/Button';

const EditSurvey: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const { data: survey, isLoading, error } = useGetSurveyDetailsQuery(surveyId || '');
  const [updateSurvey, { isLoading: isUpdating, error: updateError }] = useUpdateSurveyMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(survey?.title || '');
  const [description, setDescription] = useState(survey?.description || '');
  const [questions, setQuestions] = useState<IQuestion[]>(survey?.questions || []);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description || '');
      setQuestions(survey.questions);
    }
  }, [survey]);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', question_type: 'Text', options: [] }]);
  };

  const updateQuestion = (index: number, field: keyof IQuestion, value: string | string[]) => {
    const updatedQuestions = [...questions];
    if (field === 'options' && Array.isArray(value)) {
      updatedQuestions[index].options = value;
    } else if (field === 'question_type') {
      updatedQuestions[index].question_type = value as IQuestion['question_type'];
    } else if (field === 'question_text') {
      updatedQuestions[index].question_text = value as string;
    }
    setQuestions(updatedQuestions);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || questions.some((q) => !q.question_text)) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!surveyId) return;

    try {
      await updateSurvey({ surveyId, updates: { title, description, questions } }).unwrap();
      setFormError(null);
      navigate(`/dashboard/manage-surveys`);
    } catch (error) {
      console.error("Failed to update survey:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Failed to load survey data.</p>;

  return (
    <div className="relative mx-auto p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-lg shadow-lg">
      {/* Go Back Icon Button */}
      <button
        onClick={() => navigate('/dashboard/manage-surveys')}
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
      >
        <FaArrowLeft size={20} />
      </button>

      <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">Edit Survey</h2>
      <form onSubmit={handleUpdate} className="space-y-8">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Survey Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Enter survey title"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Provide a brief description (optional)"
          />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">Questions</h3>
        </div>

        {questions.map((question, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg mb-6 bg-white shadow">
            <input
              type="text"
              placeholder="Question Text"
              value={question.question_text}
              onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={question.question_type}
              onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Text">Text</option>
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Rating">Rating</option>
              <option value="Checkbox">Checkbox</option>
            </select>
            {(question.question_type === 'Multiple Choice' || question.question_type === 'Checkbox') && (
              <div>
                <label className="block text-gray-700 mb-2">Options (comma-separated)</label>
                <input
                  type="text"
                  onChange={(e) => updateQuestion(index, 'options', e.target.value.split(','))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Option1, Option2, Option3"
                  value={question.options ? question.options.join(', ') : ''}
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={addQuestion}
            variant="primary"
            className="mr-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200"
          >
            + Add Another Question
          </Button>
          <Button
            type="submit"
            variant="success"
            disabled={isUpdating}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
          >
            {isUpdating ? <Loader /> : <><FaCheck className="mr-2" /> Update Survey</>}
          </Button>
        </div>

        {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
        {updateError && <p className="text-red-500 text-center mt-4">Failed to update survey. Please try again.</p>}
      </form>
    </div>
  );
};

export default EditSurvey;
