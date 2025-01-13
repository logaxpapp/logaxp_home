import React from 'react';

/** Adjust these interfaces if your fields differ */
interface ITask {
  id: string;
  title: string;
  status: string;
  assignees: string[];
  dueDate: string | null;
}

interface IStatusGroup {
  _id: string;    // e.g. "In Progress", "To Do", etc.
  count: number;  // how many tasks in that status
  tasks: ITask[];
}

interface TasksByStatusViewProps {
  data: IStatusGroup[];  // the entire array from your aggregator
}

/**
 * Renders a "Tasks by Status" report in a nice, tabular format
 */
const TasksByStatusView: React.FC<TasksByStatusViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.map((group, index) => (
        <div key={index} className="border p-4 rounded bg-white shadow-sm">
          {/* Status heading */}
          <h3 className="text-lg font-semibold mb-2">
            Status: {group._id}{' '}
            <span className="ml-2 text-sm text-gray-500">
              (Total tasks: {group.count})
            </span>
          </h3>

          {/* Tasks Table */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Assignees</th>
                <th className="p-2 border">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="p-2 border">{task.id}</td>
                  <td className="p-2 border">{task.title}</td>
                  <td className="p-2 border">
                    {/* Display assignees as a comma-separated list */}
                    {task.assignees.length > 0
                      ? task.assignees.join(', ')
                      : '—'}
                  </td>
                  <td className="p-2 border">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No Due Date'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TasksByStatusView;
