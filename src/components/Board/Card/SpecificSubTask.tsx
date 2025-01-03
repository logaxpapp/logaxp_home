// src/components/Card/SpecificSubTask.tsx

import React from 'react';
import { useFetchSubTaskByIdQuery } from '../../../api/cardApi';
import { ISubTask } from '../../../types/task';

interface SpecificSubTaskProps {
  cardId: string;
  subTaskId: string;
}

const SpecificSubTask: React.FC<SpecificSubTaskProps> = ({ cardId, subTaskId }) => {
  const { data: subTask, error, isLoading } = useFetchSubTaskByIdQuery({ cardId, subTaskId });

  if (isLoading) return <p>Loading Sub-Task...</p>;
  if (error) return <p>Error fetching Sub-Task.</p>;
  if (!subTask) return <p>Sub-Task not found.</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-sm mt-2">
      <h4 className="text-lg font-medium">{subTask.title}</h4>
      <p>Status: {subTask.completed ? 'Completed' : 'Incomplete'}</p>
      {subTask.dueDate && <p>Due Date: {new Date(subTask.dueDate).toLocaleDateString()}</p>}
      {subTask.assignee && <p>Assignee ID: {subTask.assignee.toString()}</p>}
      {/* You can fetch and display assignee details if needed */}
    </div>
  );
};

export default SpecificSubTask;
