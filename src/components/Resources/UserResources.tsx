// src/components/Resources/UserResources.tsx

import React from 'react';
import { useFetchUserResourcesQuery } from '../../api/resourceApiSlice';
import { IResource } from '../../types/resourceTypes';
import AcknowledgeButton from './AcknowledgeButton';

const UserResources: React.FC = () => {
  const { data, isLoading, error } = useFetchUserResourcesQuery();

  if (isLoading) return <p>Loading resources...</p>;
  if (error) return <p>Error loading resources.</p>;

  const unacknowledgedResources = data?.filter((res: IResource) => !res.acknowledgedAt) || [];
  const acknowledgedResources = data?.filter((res: IResource) => res.acknowledgedAt) || [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Resources</h2>

      {unacknowledgedResources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Unacknowledged Resources</h3>
          <ul className="space-y-2">
            {unacknowledgedResources.map((resource: IResource) => (
              <li key={resource._id} className="flex justify-between items-center">
                <span>{resource.title}</span>
                <AcknowledgeButton resourceId={resource._id} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {acknowledgedResources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Acknowledged Resources</h3>
          <ul className="space-y-2">
            {acknowledgedResources.map((resource: IResource) => (
              <li key={resource._id} className="flex justify-between items-center">
                <span>{resource.title}</span>
                <span className="text-green-600 font-semibold">Acknowledged</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserResources;
