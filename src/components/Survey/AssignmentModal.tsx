import React from 'react';
import { useGetSurveyAssignmentsQuery } from '../../api/surveyApi';
import Loader from '../../components/Loader';
import { ISurveyAssignment } from '../../types/survey';

interface AssignmentModalProps {
  surveyId: string;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ surveyId, onClose }) => {
  const { data: assignments, error, isLoading } = useGetSurveyAssignmentsQuery(surveyId);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error loading assignments.</p>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-700">Survey Assignments</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg font-bold px-3 py-1 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {assignments && assignments.length > 0 ? (
          <table className="min-w-full bg-white border rounded-lg shadow-sm overflow-hidden">
            <thead className="bg-blue-100 border-b">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">User/Email</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Due Date</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment: ISurveyAssignment) => (
                <tr key={assignment._id} className="border-b hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-6">
                    {typeof assignment.user === 'object'
                      ? `${assignment.user.name} (${assignment.user.email})`
                      : assignment.user || 'N/A'}
                  </td>
                  <td className="py-3 px-6">
                    {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        assignment.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-6">No assignments found for this survey.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentModal;
