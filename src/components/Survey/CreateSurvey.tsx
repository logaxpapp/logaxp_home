import React, { useState } from 'react';
import { useCreateSurveyMutation } from '../../api/surveyApi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/Loader';
import { IQuestion } from '../../types/survey';
import { FaPlus, FaCheck, FaArrowLeft } from 'react-icons/fa';

const CreateSurvey: React.FC = () => {
  const [createSurvey, { isLoading, error }] = useCreateSurveyMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', question_type: 'Text', options: [] }]);
  };

  const updateQuestion = (index: number, field: keyof IQuestion, value: string | string[]) => {
    const updatedQuestions = [...questions];
    
    if (field === 'options' && Array.isArray(value)) {
      updatedQuestions[index].options = value as string[];
    } else if (field === 'question_type' && isQuestionType(value)) {
      updatedQuestions[index].question_type = value;
    } else if (field === 'question_text' && typeof value === 'string') {
      updatedQuestions[index].question_text = value;
    }
    
    setQuestions(updatedQuestions);
  };

  const isQuestionType = (value: any): value is IQuestion['question_type'] => {
    return ['Multiple Choice', 'Text', 'Rating', 'Checkbox'].includes(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || questions.some((q) => !q.question_text)) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      await createSurvey({ title, description, questions }).unwrap();
      setFormError(null);
      navigate('/dashboard/manage-surveys');
    } catch (err) {
      console.error("Failed to create survey:", err);
    }
  };

  return (
    <div className="relative mx-auto p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-lg shadow-lg">
      {/* Go Back Icon Button */}
      <button
        onClick={() => navigate('/dashboard/manage-surveys')}
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
      >
        <FaArrowLeft size={20} />
      </button>

      <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">Create a New Survey</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
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
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
          >
            {isLoading ? <Loader /> : <><FaCheck className="mr-2" /> Create Survey</>}
          </Button>
        </div>

        {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
        {error && <p className="text-red-500 text-center mt-4">Failed to create survey. Please try again.</p>}
      </form>
    </div>
  );
};

export default CreateSurvey;
