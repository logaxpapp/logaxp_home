// src/components/Tickets/ActivityLog.tsx

import React from 'react';
import { IActivityLog } from '../../types/ticket';
import { IUser } from '../../types/user';

interface ActivityLogProps {
  activities: IActivityLog[];
  usersData?: IUser[]; // Pass users data if needed
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, usersData }) => {
  if (!activities || activities.length === 0) {
    return <p>No activity yet.</p>;
  }

  const usersMap = new Map<string, IUser>();
  usersData?.forEach((user) => {
    usersMap.set(user._id, user);
  });

  const getPerformerName = (performedBy: string | IUser): string => {
    if (typeof performedBy === 'string') {
      return usersMap.get(performedBy)?.name || performedBy;
    } else if (performedBy && performedBy.name) {
      return performedBy.name;
    } else {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="border p-4 rounded">
          <p className="text-sm text-gray-600">
            <strong>{getPerformerName(activity.performedBy.name)}</strong> performed action: {activity.action} on{' '}
            {new Date(activity.date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
