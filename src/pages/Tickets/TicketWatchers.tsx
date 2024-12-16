// TicketWatchers.tsx
import React from 'react';
import { useFetchTicketWatchersQuery } from '../../api/ticketsApi';

interface TicketWatchersProps {
  ticketId: string;
  expanded: boolean;
}

const TicketWatchers: React.FC<TicketWatchersProps> = ({ ticketId, expanded }) => {
  const { data: watchersData, isLoading: watchersLoading, isError: watchersError } =
    useFetchTicketWatchersQuery(ticketId, {
      skip: !expanded,
    });

  if (!expanded) return null;

  return (
    <div className="mt-2 bg-gray-50 p-2 rounded">
      {watchersLoading && <div className="text-sm text-gray-500">Loading watchers...</div>}
      {watchersError && <div className="text-sm text-red-500">Failed to load watchers.</div>}
      {watchersData && watchersData.watchers.length === 0 && (
        <div className="text-sm text-gray-500">No watchers.</div>
      )}
      {watchersData && watchersData.watchers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {watchersData.watchers.map((w) => (
            <span
              key={w._id}
              className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5"
            >
              {w.name || w.email}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketWatchers;
