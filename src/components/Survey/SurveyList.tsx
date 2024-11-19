import React, { useState } from 'react';
import { useGetAllSurveysQuery, useDeleteSurveyMutation } from '../../api/surveyApi';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Button from '../../components/common/Button/Button';
import { FaPlus, FaEdit, FaTasks, FaEye, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { ISurvey } from '../../types/survey';
import AssignmentModal from './AssignmentModal';

const SurveyList: React.FC = () => {
  const { data: surveys, error, isLoading } = useGetAllSurveysQuery();
  const [deleteSurvey] = useDeleteSurveyMutation();
  const navigate = useNavigate();
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const handleDeleteSurvey = async (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(surveyId).unwrap();
        alert('Survey deleted successfully');
      } catch (err) {
        console.error('Failed to delete survey:', err);
      }
    }
  };

  const columns: Column<ISurvey>[] = [
    {
      header: 'Title',
      accessor: (survey: ISurvey) => (
        <Link
          to={`/dashboard/surveys/${survey._id}`}
          className="text-blue-600 font-semibold line-clamp-1 hover:underline"
          title={survey.title}
        >
          {survey.title}
        </Link>
      ),
      sortable: true,
    },
    {
      header: 'Description',
      accessor: (survey: ISurvey) => (
        <span className="text-gray-700 line-clamp-2" title={survey.description}>
          {survey.description || 'No description'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (survey: ISurvey) => (
        <div className="relative">
          <Button
            variant="light"
            onClick={() => setShowActions(showActions === survey._id ? null : survey._id)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaEllipsisV />
          </Button>

          {showActions === survey._id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <Button
                variant="edit"
                size="small"
                onClick={() => navigate(`/dashboard/edith-survey/${survey._id}`)}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
              >
                <FaEdit className="mr-2" /> Edit
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate(`/surveys/assign/${survey._id}`)}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
              >
                <FaTasks className="mr-2" /> Assign
              </Button>
              <Button
                variant="view"
                size="small"
                onClick={() => setSelectedSurveyId(survey._id)}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
              >
                <FaEye className="mr-2" /> View Assignments
              </Button>
              <Button
                variant="delete"
                size="small"
                onClick={() => handleDeleteSurvey(survey._id)}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-red-600"
              >
                <FaTrash className="mr-2" /> Delete
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error loading surveys. Please try again later.</p>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-800">Survey List</h2>
        <Button
          variant="primary"
          size="medium"
          className="flex items-center"
          onClick={() => navigate('/dashboard/create-survey')}
        >
          <FaPlus className="mr-2" /> Create Survey
        </Button>
      </div>

      <DataTable data={surveys || []} columns={columns} />

      {selectedSurveyId && (
        <AssignmentModal surveyId={selectedSurveyId} onClose={() => setSelectedSurveyId(null)} />
      )}
    </div>
  );
};

export default SurveyList;
