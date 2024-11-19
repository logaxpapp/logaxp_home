import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserSurveysQuery } from '../../api/surveyApi';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { FaEye, FaPen } from 'react-icons/fa';

interface ISurveyWithAssignment {
  _id: string; // Survey ID
  title: string;
  description?: string;
  assignmentId?: string; // Assignment ID if linked to an assignment
}

const MySurvey: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data, error, isLoading } = useGetUserSurveysQuery({ status: 'Pending' });
  const surveys = (data?.surveys || []) as ISurveyWithAssignment[];

  // Debugging: Log the survey data to check if assignmentId is present
  console.log('Fetched survey data:', data);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading surveys.</p>;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 font-primary text-center md:text-left">
        My Assigned Surveys
      </h2>

      {surveys.length > 0 ? (
        <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200 font-primary">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900">
              <tr>
                <th className="py-4 px-6 text-left text-sm lg:text-lg font-semibold border-b">Survey Title</th>
                <th className="py-4 px-6 text-left text-sm lg:text-lg font-semibold border-b">Description</th>
                <th className="py-4 px-6 text-left text-sm lg:text-lg font-semibold border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr
                  key={`${survey._id}-${survey.assignmentId || 'view'}`}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="py-4 px-6 text-gray-700 font-medium text-sm lg:text-base">{survey.title}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm lg:text-base">
                    {survey.description || 'No description available'}
                  </td>
                  <td className="py-4 px-6 flex flex-wrap gap-4 items-center">
                    {/* View Button */}
                    <Link
                      to={`/dashboard/surveys/${survey._id}`}
                      className="flex items-center px-3 py-1.5 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold transition"
                    >
                      <FaEye className="mr-2" />
                      View
                    </Link>

                    {/* Respond Button */}
                    {survey.assignmentId && (
                      <Link
                        to={`/dashboard/surveys/${survey._id}/assignments/${survey.assignmentId}`}
                        className="flex items-center px-3 py-1.5 text-green-600 bg-green-100 hover:bg-green-200 rounded-md text-sm font-semibold transition"
                      >
                        <FaPen className="mr-2" />
                        Respond
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-50 text-right p-4 text-gray-700 border-t">
            Total Surveys Assigned: <span className="font-bold">{data?.total || 0}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 p-6 bg-gray-100 rounded-lg shadow-md">
          <p>No surveys assigned to you at the moment.</p>
          <p>Check back later for updates!</p>
        </div>
      )}
    </div>
  );
};

export default MySurvey;
