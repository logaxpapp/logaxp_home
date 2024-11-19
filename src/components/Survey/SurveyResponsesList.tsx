import React, { useState } from 'react';
import { useGetAllSurveyResponsesQuery } from '../../api/surveyApi';
import Loader from '../../components/Loader';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Pagination from '../../components/common/Pagination/Pagination';
import SurveyResponsesDetail from './SurveyResponsesDetail';
import { ISurveyResponse } from '../../types/survey';

const SurveyResponsesList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, error, isLoading } = useGetAllSurveyResponsesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Group responses by survey
  const surveys = data?.responses
    ? data.responses.reduce((acc: Record<string, any>, response: ISurveyResponse) => {
        const survey = response.survey_assignment.survey;
        if (!acc[survey._id]) {
          acc[survey._id] = {
            ...survey,
            responses: [],
          };
        }
        acc[survey._id].responses.push(response);
        return acc;
      }, {})
    : {}; // Default empty object to avoid undefined errors

  const columns: Column<any>[] = [
    {
      header: 'Survey Title',
      accessor: 'title',
      Cell: ({ value }) => (
        <span className="text-blue-600 font-semibold">
          {typeof value === 'string' ? value : JSON.stringify(value)}
        </span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      Cell: ({ value }) => (
        <span className="text-gray-700 truncate block max-w-xs">{value || 'No description'}</span>
      ),
    },
    {
      header: 'Responses Count',
      accessor: (survey: any) => (
        <span className="text-center font-medium">{survey.responses?.length ?? 0}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (survey: any) => (
        <button
          className="px-4 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          onClick={() => setSelectedSurveyId(survey._id)}
        >
          View Responses
        </button>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error loading survey responses.</p>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-3xl font-semibold font-primary text-blue-800">Survey Responses List</h2>
      </div>

      {selectedSurveyId && surveys[selectedSurveyId] ? (
        <SurveyResponsesDetail
          survey={surveys[selectedSurveyId]}
          onClose={() => setSelectedSurveyId(null)}
        />
      ) : (
        <>
          <DataTable data={Object.values(surveys)} columns={columns} />
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={data?.pages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SurveyResponsesList;
