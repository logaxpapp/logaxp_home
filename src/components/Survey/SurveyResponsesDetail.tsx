// SurveyResponsesDetail.tsx

import React from 'react';

interface SurveyResponsesDetailProps {
  survey: {
    _id: string;
    title: string;
    description: string;
    responses: any[];
  };
  onClose: () => void;
}

const SurveyResponsesDetail: React.FC<SurveyResponsesDetailProps> = ({ survey, onClose }) => {
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-800">{survey.title}</h2>
        <button
          className="px-4 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Back to Survey List
        </button>
      </div>

      <p className="text-gray-600 mb-6 italic">{survey.description || 'No description available'}</p>

      <div className="space-y-6">
        {survey.responses.map((response, idx) => (
          <div key={response._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Response {idx + 1}</h3>
            <ul className="space-y-2">
              {response.responses.map((answer: any, answerIdx: number) => (
                <li key={answerIdx} className="p-2 bg-white rounded-md shadow-sm">
                  <strong className="block text-gray-800">Question:</strong>
                  <span className="text-gray-600">{answer.question_id?.question_text || 'Question not found'}</span>
                  <strong className="block text-gray-800 mt-1">Answer:</strong>
                  <span className="text-gray-600">
                    {Array.isArray(answer.response_text)
                      ? answer.response_text.join(', ')
                      : answer.response_text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResponsesDetail;
