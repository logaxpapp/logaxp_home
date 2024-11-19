import React from 'react';
import { useGetSurveyDetailsQuery, useDeleteSurveyMutation } from '../../api/apiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../common/Button/Button';

const SurveyItem: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const { data: survey, error, isLoading } = useGetSurveyDetailsQuery(surveyId || '');
  const [deleteSurvey] = useDeleteSurveyMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (surveyId && window.confirm('Are you sure you want to delete this survey?')) {
      await deleteSurvey(surveyId);
      navigate('/surveys'); // Redirect to surveys list
    }
  };

  if (isLoading) return <p>Loading survey details...</p>;
  if (error) return <p>Error loading survey details.</p>;

  return (
    <div>
      <h1>{survey?.title}</h1>
      <p>{survey?.description}</p>
      <Button onClick={handleDelete} variant="danger">Delete Survey</Button>
    </div>
  );
};

export default SurveyItem;
