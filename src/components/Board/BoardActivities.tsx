// src/components/BoardActivities.tsx

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiActivity, FiTrash2 } from 'react-icons/fi';
import { useFetchActivitiesQuery, useDeleteActivityMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { IActivity } from '../../types/task';

interface BoardActivitiesProps {
  boardId: string;
}

const BoardActivities: React.FC<BoardActivitiesProps> = ({ boardId }) => {
  // ---------------------------
  // Hooks & State
  // ---------------------------
  const { data: activities, error, isLoading } = useFetchActivitiesQuery({ boardId });
  const [deleteActivity] = useDeleteActivityMutation();
  const { showToast } = useToast();
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleDelete = async (activityId: string) => {
    // Optional: add a quick confirmation for the user
    const confirmDelete = window.confirm('Are you sure you want to delete this activity?');
    if (!confirmDelete) return;

    try {
      await deleteActivity(activityId).unwrap();
      showToast('Activity deleted.', 'success');
    } catch (err) {
      showToast('Error deleting activity.', 'error');
    }
  };

  // ---------------------------
  // Early Returns (Loading/Error/No Data)
  // ---------------------------
  if (isLoading) {
    return <p className="text-gray-500">Loading activities...</p>;
  }

  if (error) {
    showToast('Error fetching activities.', 'error');
    return <p className="text-red-500">Error fetching activities.</p>;
  }

  if (!activities || activities.length === 0) {
    return <p className="text-yellow-500">No activities found.</p>;
  }

  // ---------------------------
  // Filtering & Searching
  // ---------------------------
  const filteredActivities = activities.filter((activity: IActivity) => {
    const matchesSearch = activity.details
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'All' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiActivity />
        Recent Activities
      </h3>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Moved">Moved</option>
            {/* Add other activity types if needed */}
          </select>
          <FiFilter className="absolute top-3 right-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <p className="text-sm text-gray-500">No results found for your filters/search.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity: IActivity) => (
            <li key={activity._id} className="border-b pb-2">
              <p>
                <strong className="text-blue-600">
                  {activity.user && activity.user.email
                    ? activity.user.email
                    : 'Unknown User'}
                </strong>{' '}
                {activity.details}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(activity.createdAt).toLocaleString()}
              </p>

              {/* Admin-Only Delete Button */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="text-red-500 hover:text-red-700 ml-2 inline-flex items-center gap-1"
                  title="Delete Activity"
                >
                  <FiTrash2 />
                  <span className="text-xs">Delete</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardActivities;
