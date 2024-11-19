import React, { useState } from 'react';
import { useGetAllSurveyResponsesQuery } from '../../api/surveyApi';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/Loader';
import { ISurveyResponse } from '../../types/survey';

const SurveyResponses: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useGetAllSurveyResponsesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error loading survey responses.</p>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Survey Responses</h2>
      </div>

      {data?.responses && data.responses.length > 0 ? (
        <>
          <ul className="space-y-4">
            {data.responses.map((response: ISurveyResponse) => (
              <li key={response._id} className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">
                  Survey: {response.survey_assignment.survey.title || 'Untitled Survey'}
                </h3>
                <ul className="mt-2">
                  {response.responses.map((answer, idx) => (
                    <li key={idx}>
                       <strong>Question:</strong> {(answer.question_id as any)?.question_text || "Question not found"}<br />
                       <strong>Answer:</strong> {Array.isArray(answer.response_text) ? answer.response_text.join(', ') : answer.response_text}
                      {Array.isArray(answer.response_text)
                        ? answer.response_text.join(', ')
                        : answer.response_text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={data.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center">No survey responses found.</p>
      )}
    </div>
  );
};

export default SurveyResponses;
