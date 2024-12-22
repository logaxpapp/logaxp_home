import React from 'react';
import { useFetchUserResourcesQuery } from '../../api/resourceApiSlice';
import { IResource } from '../../types/resourceTypes';
import AcknowledgeButton from './AcknowledgeButton';

const UserResources: React.FC = () => {
  const { data, isLoading, error } = useFetchUserResourcesQuery();

  if (isLoading) return <p className="text-center text-blue-500">Loading resources...</p>;
  if (error) return <p className="text-center text-red-500">Error loading resources. Please try again.</p>;

  const resources = data || [];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-4">
        My Resources
      </h2>

      {resources.length === 0 ? (
        <p className="text-center text-gray-500">No resources available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: IResource) => (
            <div
              key={resource._id}
              className="border rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {resource.title}
                </h3>
                {resource.acknowledgedAt ? (
                  <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Acknowledged
                  </span>
                ) : (
                  <AcknowledgeButton resourceId={resource._id} />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>Type: {resource.type}</p>
                <p>Tags: {resource.tags?.join(', ') || 'None'}</p>
                <p>Created At: {new Date(resource.createdAt).toLocaleString()}</p>
              </div>
              {resource.acknowledgedAt && resource.signature && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Acknowledged Details</h4>
                  <div
                    className="italic text-lg border rounded-md p-3 bg-gray-50 dark:bg-gray-700 mt-2"
                    style={{
                      fontFamily: resource.font,
                      fontSize: resource.size,
                      color: resource.color,
                    }}
                  >
                    {resource.signature}
                    <p className="text-xs mt-2 text-gray-500">Signature</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Acknowledged At: {new Date(resource.acknowledgedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserResources;
