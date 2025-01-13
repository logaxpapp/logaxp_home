// src/components/Report/ReportViews/TasksByUserView.tsx

import React from 'react';

interface ITask {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface IUserGroup {
  count: number;
  tasks: ITask[];
  user: string;
  email: string;
}

interface TasksByUserViewProps {
  data: IUserGroup[];
}

/**
 * Renders a "Tasks by User" report in a nice table or list
 */
const TasksByUserView: React.FC<TasksByUserViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.map((group, index) => (
        <div key={index} className="border p-4 rounded bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">
            {group.user} <span className="text-sm text-gray-500">({group.email})</span>
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Total Tasks: <strong>{group.count}</strong>
          </p>

          {/* Table of tasks */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Priority</th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="p-2 border text-gray-600">{task.id}</td>
                  <td className="p-2 border text-gray-800">{task.title}</td>
                  <td className="p-2 border text-gray-600">{task.status}</td>
                  <td className="p-2 border text-gray-600">{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TasksByUserView;
