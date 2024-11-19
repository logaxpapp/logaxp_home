import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllSurveyResponsesQuery } from '../../api/surveyApi';
import SurveyResponsesDetail from './SurveyResponsesDetail';
import Loader from '../../components/Loader';
import Pagination from '../../components/common/Pagination/Pagination';

const SurveyResponsesDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  if (error) return <p className="text-red-500 text-center">Error loading survey detail.</p>;

  // Filter responses for the specific survey ID
  const surveyResponses = data?.responses.filter(
    (response) => response.survey_assignment.survey._id === id
  );

  if (!surveyResponses || surveyResponses.length === 0)
    return <p className="text-center text-gray-600">No responses found for this survey.</p>;

  // Construct survey object with responses included, ensuring `description` is a string
  const surveyWithResponses = {
    ...surveyResponses[0].survey_assignment.survey, // Original survey details
    description: surveyResponses[0].survey_assignment.survey.description || 'No description available',
    responses: surveyResponses, // All responses for this survey
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <SurveyResponsesDetail survey={surveyWithResponses} onClose={() => navigate(-1)} />

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={data?.pages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SurveyResponsesDetailWrapper;
