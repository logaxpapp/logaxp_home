import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchChangeRequestByIdQuery } from '../../api/changeRequestApi';
import Loader from '../Loader';
import { FaChevronLeft } from 'react-icons/fa';

const ChangeRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: changeRequest, isLoading, error } = useFetchChangeRequestByIdQuery(id || '');

  if (!id) {
    return <p className="text-red-600">Invalid or missing change request ID.</p>;
  }

  if (isLoading) return <Loader />;
  if (error) {
    return <p className="text-red-600">Failed to load change request details.</p>;
  }

  if (!changeRequest) {
    return <p className="text-gray-500">Change request not found.</p>;
  }

  return (
    <div className="container mx-auto p-8 mt-8 bg-white rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <FaChevronLeft />
        Back
      </button>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Change Request Details</h1>

      {/* Status and Created Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-500 uppercase font-semibold">Status</p>
          <p className="text-lg text-gray-700 font-bold">{changeRequest.status}</p>
        </div>
        <div className="p-4 bg-gray-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-gray-500 uppercase font-semibold">Created At</p>
          <p className="text-lg text-gray-700 font-bold">
            {new Date(changeRequest.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Fields to Change */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Fields to Change</h2>
        <div className="bg-gray-50 p-4 rounded shadow-md">
          {Object.entries(changeRequest.request_data.fields_to_change).map(([field, value]) => (
            <div
              key={field}
              className="flex justify-between items-center border-b border-gray-200 py-2"
            >
              <span className="font-medium text-gray-600">{field}</span>
              <span className="text-gray-800">
                {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Approval History</h2>
        <div className="space-y-4">
          {changeRequest.history.map((entry, index) => (
            <div
              key={index}
              className="p-4 bg-white border rounded shadow-md transition hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">
                <strong>Step:</strong> {entry.step_name}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong>{' '}
                <span
                  className={`font-bold ${
                    entry.status === 'Approved'
                      ? 'text-green-600'
                      : entry.status === 'Rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {entry.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong>{' '}
                {entry.decision_date ? new Date(entry.decision_date).toLocaleString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Comments:</strong>{' '}
                <span className="italic text-gray-700">
                  {entry.comments || 'No comments provided'}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetail;
