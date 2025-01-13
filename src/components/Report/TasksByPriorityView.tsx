import React from 'react';

/** Basic shape for each task under a given priority group */
interface IPriorityTask {
  id: string;
  title: string;
  priority: string; // e.g. "Medium"
  status: string;   // e.g. "Pending"
}

/** Shape of each aggregator group: { _id: "Medium", count: 3, tasks: [...] } */
interface IPriorityGroup {
  _id: string;
  count: number;
  tasks: IPriorityTask[];
}

interface TasksByPriorityViewProps {
  data: IPriorityGroup[];  // The entire aggregator array
}

/**
 * Renders a “Tasks by Priority” report in a simple table layout.
 */
const TasksByPriorityView: React.FC<TasksByPriorityViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.map((group, index) => (
        <div
          key={index}
          className="border p-4 rounded bg-white shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-2">
            Priority: {group._id}
            <span className="ml-2 text-sm text-gray-500">
              (Total tasks: {group.count})
            </span>
          </h3>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="p-2 border">{task.id}</td>
                  <td className="p-2 border">{task.title}</td>
                  <td className="p-2 border">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TasksByPriorityView;
