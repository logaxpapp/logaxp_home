import React from 'react';
import {
  useFetchResourceByIdQuery,
  useFetchRelatedResourcesQuery,
} from '../../api/resourceApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultImage from '../../assets/images/doccenter.png';
import logo from '../../assets/images/sec.png';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: resource,
    isLoading: isResourceLoading,
    error: resourceError,
  } = useFetchResourceByIdQuery(id!);
  const {
    data: relatedResources,
    isLoading: isRelatedLoading,
    error: relatedError,
  } = useFetchRelatedResourcesQuery({ id: id! });

  const navigate = useNavigate();

  if (isResourceLoading || isRelatedLoading) return <p>Loading...</p>;
  if (resourceError || relatedError || !resource)
    return <p>Error loading resource details or related resources.</p>;

  return (
    <div className="container mx-auto py-8 px-6">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-10 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-6">
          <img src={logo} alt="Company Logo" className="h-5 w-auto rounded-md" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Resource Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore detailed insights and related materials.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/resources')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow"
        >
          Back to Resources
        </button>
      </header>

      {/* Main Content Section with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
            Details
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4">
            <div>
              <span className="font-semibold">Type:</span>
              <span className="bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-blue-100 px-2 py-1 rounded-md ml-2">
                {resource.type}
              </span>
            </div>
            <div>
              <span className="font-semibold">Created:</span>
              <span className="ml-2">
                {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-semibold">Written By:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-200">
                {resource.createdBy.name}
              </span>
            </div>
            {resource.tags.length > 0 && (
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content Section */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
            {resource.title}
          </h2>

          {/* Main Image */}
          <img
            src={resource.images?.[0] || DefaultImage}
            alt="Resource"
            className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
          />

          {/* Text Content */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {resource.content}
          </p>

          {/* Additional Images */}
          {resource.images && resource.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {resource.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Additional Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Resources Section */}
      {relatedResources && relatedResources.length > 0 ? (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Related Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedResources
              .filter((related) => related._id !== resource._id)
              .map((related) => (
                <div
                  key={related._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => navigate(`/dashboard/resources/${related._id}`)}
                >
                  <img
                    src={related.images?.[0] || DefaultImage}
                    alt="Related Resource"
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {related.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            No Related Resources
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Currently, there are no related resources for this item. Explore more
            resources in the{' '}
            <button
              onClick={() => navigate('/dashboard/resources')}
              className="text-blue-600 hover:underline"
            >
              resources list
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceDetail;
