import React, { useState } from 'react';
import { useGetUserSurveyResponsesQuery } from '../../api/surveyApi';
import Loader from '../../components/Loader';
import Pagination from '../../components/common/Pagination/Pagination';
import { ISurveyAssignment } from '../../types/survey';

const MySurveyResponses: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const { data, error, isLoading } = useGetUserSurveyResponsesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  console.log(data);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">Error loading completed surveys.</p>;

  return (
    <div className="bg-blue-50 p-4">
      

      {data?.responses && data.responses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.responses.map((response) => {
              const survey = (response.survey_assignment as ISurveyAssignment).survey;
              return (
                <div
                  key={response._id}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {survey?.title || "Untitled Survey"}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                    {survey?.description || "No description available"}
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Component */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={data.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center text-lg">No surveys completed yet. Check back later!</p>
      )}
    </div>
  );
};

export default MySurveyResponses;
