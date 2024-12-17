import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserSurveysQuery } from '../../api/surveyApi';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { FaEye, FaPen } from 'react-icons/fa';

interface ISurveyWithAssignment {
  _id: string;
  title: string;
  description?: string;
  assignmentId?: string;
}

const MySurvey: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data, error, isLoading } = useGetUserSurveysQuery({ status: 'Pending' });
  const surveys = (data?.surveys || []) as ISurveyWithAssignment[];

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-6">
        Error loading surveys. Please try again later.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
     

      {surveys.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Survey Title</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Description</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr
                  key={survey._id}
                  className="hover:bg-gray-50 border-t transition-all duration-200"
                >
                  <td className="py-3 px-4 text-gray-800">{survey.title}</td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                    {survey.description || 'No description'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/dashboard/surveys/${survey._id}`}
                        className="flex items-center px-2 py-1 border rounded hover:bg-blue-100 text-blue-600"
                      >
                        <FaEye className="mr-1" /> View
                      </Link>
                      {survey.assignmentId && (
                        <Link
                          to={`/dashboard/surveys/${survey._id}/assignments/${survey.assignmentId}`}
                          className="flex items-center px-2 py-1 border rounded hover:bg-green-100 text-green-600"
                        >
                          <FaPen className="mr-1" /> Respond
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-50 text-gray-700 p-4 text-sm text-center border-t">
            Total Surveys Assigned: <span className="font-semibold">{data?.total || 0}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          <p className="text-lg">No surveys assigned to you at the moment.</p>
          <p className="text-sm">Please check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default MySurvey;
