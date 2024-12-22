import React, { useState } from 'react';
import { useFetchResourcesQuery } from '../../api/resourceApiSlice';
import { IResource, ResourceType } from '../../types/resourceTypes';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const PolicyAcknowledgement: React.FC = () => {
  const { data, isLoading, error } = useFetchResourcesQuery({
    page: 1,
    limit: 100,
    type: ResourceType.Policy,
  });
 
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

 

  if (isLoading) return <p className="text-center">Loading policies...</p>;
  if (error) return <p className="text-center text-red-500">Error loading policies.</p>;

  const resources: IResource[] = data?.resources || [];

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white p-2 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Policy Acknowledgement</h1>
          <div className="text-right">
            <h2 className="text-lg">{currentUser?.name || 'User'}</h2>
            {currentUser?.department && <p className="italic">{currentUser.department}</p>}
          </div>
        </div>
      </header>

     {/* Main Content */}
     <main className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">
          Company Policies
        </h2>
        {resources.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No policies available at the moment.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((policy) => (
              <li key={policy._id} className="py-4 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{policy.title}</span>
                <button
                  onClick={() => navigate(`/dashboard/policy/${policy._id}`, { state: { policy } })}
                  className="bg-lemonGreen-light text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  View & Acknowledge
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default PolicyAcknowledgement;