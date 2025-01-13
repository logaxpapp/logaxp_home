// src/components/Report/ReportViews/TasksByBoardView.tsx

import React, { useState, useRef } from 'react';
import {
  IBoardGroup,
  IListData,
  ICard,
  IComment,
  IAttachment,
  ITimeLog,
  ISubTask,
  IAssignee,
} from '../../types/task';
import { format } from 'date-fns';
import { FaComments, FaPaperclip, FaClock, FaDownload, FaPrint, FaSave } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useToast } from '../../features/Toast/ToastContext';

/**
 * Color mappings for status and priority
 */
const statusColors: Record<string, string> = {
  'In Progress': 'bg-yellow-500',
  Pending: 'bg-blue-500',
  Backlog: 'bg-gray-500',
  Done: 'bg-green-500',
  // Add more statuses as needed
};

const priorityColors: Record<string, string> = {
  High: 'text-red-600',
  Medium: 'text-yellow-600',
  Low: 'text-green-600',
  // Add more priorities as needed
};

/**
 * Props for the component
 */
interface TasksByBoardViewProps {
  data: IBoardGroup[];
}

/**
 * Helper type guards
 */
const isICommentArray = (comments: IComment[] | string[]): comments is IComment[] => {
  return typeof comments[0] === 'object';
};

const isIAttachmentArray = (attachments: IAttachment[] | string[]): attachments is IAttachment[] => {
  return typeof attachments[0] === 'object';
};

/**
 * Component to display tasks organized by board and list
 */
const TasksByBoardView: React.FC<TasksByBoardViewProps> = ({ data }) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const reportRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  /**
   * Toggles the expansion state of a task
   * @param taskId - The ID of the task to toggle
   */
  const toggleTaskExpansion = (taskId: string) => {
    const newExpandedTasks = new Set(expandedTasks);
    if (newExpandedTasks.has(taskId)) {
      newExpandedTasks.delete(taskId);
    } else {
      newExpandedTasks.add(taskId);
    }
    setExpandedTasks(newExpandedTasks);
  };

  /**
   * Calculates the total time logged for a task
   * @param timeLogs - Array of time logs
   * @returns Total duration in minutes
   */
  const calculateTotalTime = (timeLogs?: ITimeLog[]) => {
    return timeLogs ? timeLogs.reduce((acc, log) => acc + log.duration, 0) : 0;
  };

  /**
   * Handles downloading the report as PDF
   */
  const handleDownload = async () => {
    if (reportRef.current) {
      const toastId = showToast('Generating PDF...', 'info', 0);
      try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('tasks_report.pdf');
        showToast( 'PDF Downloaded!', 'success');
      } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Failed to generate PDF.', 'error' );
      }
    }
  };

  /**
   * Handles printing the report
   */
  const handlePrint = () => {
    if (reportRef.current) {
      const printContent = reportRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // To ensure React rehydrates correctly
    }
  };

  /**
   * Handles saving the report data as JSON
   */
  const handleSave = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, 'tasks_report.json');
    showToast('Report Saved Locally!', 'success');
  };


  console.log('TasksByBoardView rendered', data);
  return (
    <div className="space-y-8">
      {/* Toast Notifications */}


      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FaDownload className="mr-2" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <FaPrint className="mr-2" />
          Print
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          <FaSave className="mr-2" />
          Save JSON
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-8 bg-gray-100 p-6 rounded-lg shadow-md">
        {data.map((boardGroup, boardIdx) => (
          <div
            key={boardIdx}
            className="border border-gray-300 p-6 rounded-lg bg-white shadow-sm"
          >
            {/* Board Header */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Board: {boardGroup._id}
              <span className="ml-4 text-lg text-gray-500">
                (Total Tasks: {boardGroup.totalTasks})
              </span>
            </h2>

            {/* Lists within the Board */}
            <div className="space-y-6">
              {boardGroup.tasks.map((listItem: IListData, listIdx: number) => (
                <div key={listIdx}>
                  {/* List Header */}
                  <h3 className="text-xl font-medium mb-3 text-gray-700">
                    List: {listItem.list}
                    <span className="ml-2 text-lg text-gray-500">
                      (Tasks: {listItem.tasks.length})
                    </span>
                  </h3>

                  {/* Tasks Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                        
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assignees</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Labels</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Attachments</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comments</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Time Logged</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listItem.tasks.map((task: ICard) => (
                          <React.Fragment key={task._id}>
                            <tr className="hover:bg-gray-100">
                              
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                <button
                                  onClick={() => toggleTaskExpansion(task._id)}
                                  className="text-blue-600 hover:underline focus:outline-none"
                                >
                                  {task.title}
                                </button>
                              </td>
                              <td className="px-4 py-2 text-sm border-b">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    statusColors[task.status] || 'bg-gray-500'
                                  } text-white`}
                                >
                                  {task.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm border-b">
                                <span className={`font-semibold ${priorityColors[task.priority] || 'text-gray-700'}`}>
                                  {task.priority}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {task.assignees.length > 0
                                  ? (task.assignees as (string | IAssignee)[]).map((assignee, index) => {
                                      if (typeof assignee === 'string') {
                                        return assignee;
                                      } else {
                                        return assignee.name;
                                      }
                                    }).join(', ')
                                  : '—'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {task.dueDate
                                  ? format(new Date(task.dueDate), 'PPP')
                                  : 'No Due Date'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {task.labels.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {task.labels.map((label, labelIdx) => (
                                      <span
                                        key={labelIdx}
                                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                      >
                                        {label.name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {task.attachments.length > 0 ? (
                                  <div className="flex items-center space-x-1">
                                    <FaPaperclip className="text-gray-500" />
                                    <span>{task.attachments.length}</span>
                                  </div>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {task.comments.length > 0 ? (
                                  <div className="flex items-center space-x-1">
                                    <FaComments className="text-gray-500" />
                                    <span>{task.comments.length}</span>
                                  </div>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                {calculateTotalTime(task.timeLogs)} mins
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                <button
                                  onClick={() => toggleTaskExpansion(task._id)}
                                  className="text-blue-600 hover:underline focus:outline-none"
                                >
                                  {expandedTasks.has(task._id) ? 'Collapse' : 'Expand'}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded Task Details */}
                            {expandedTasks.has(task._id) && (
                              <tr>
                                <td colSpan={11} className="bg-gray-50">
                                  <div className="p-4">
                                    {/* Description */}
                                    <div className="mb-3">
                                      <h4 className="text-md font-medium text-gray-800">Description:</h4>
                                      <p className="text-sm text-gray-700">
                                        {task.description || 'No Description.'}
                                      </p>
                                    </div>

                                    {/* Sub-Tasks */}
                                    {task.subTasks && task.subTasks.length > 0 && (
                                      <div className="mb-3">
                                        <h4 className="text-md font-medium text-gray-800">Sub-Tasks:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                          {task.subTasks.map((subTask: ISubTask) => (
                                            <li key={subTask.id || subTask.title}>
                                              <span
                                                className={`font-semibold border-b ${
                                                  subTask.completed ? 'text-green-600' : 'text-red-600'
                                                }`}
                                              >
                                                {subTask.title}
                                              </span>
                                              {subTask.completed ? ' ✓' : ' ✗'}
                                              {subTask.dueDate && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                  (Due: {format(new Date(subTask.dueDate), 'PPP')})
                                                </span>
                                              )}
                                              {subTask.assignee && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                  Assigned to: {subTask.assignee}
                                                </span>
                                              )}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Time Logs */}
                                    {task.timeLogs && task.timeLogs.length > 0 && (
                                      <div className="mb-3">
                                        <h4 className="text-md font-medium text-gray-800">Time Logs:</h4>
                                        <table className="min-w-full border border-gray-200 text-sm">
                                          <thead className="bg-gray-100">
                                            <tr>
                                              <th className="px-2 py-1 border">User</th>
                                              <th className="px-2 py-1 border">Start</th>
                                              <th className="px-2 py-1 border">End</th>
                                              <th className="px-2 py-1 border">Duration (mins)</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {task.timeLogs.map((log: ITimeLog) => (
                                              <tr key={log.id}>
                                                <td className="px-2 py-1 border">{log.user}</td>
                                                <td className="px-2 py-1 border">
                                                  {format(new Date(log.start), 'PPPpp')}
                                                </td>
                                                <td className="px-2 py-1 border">
                                                  {log.end ? format(new Date(log.end), 'PPPpp') : '—'}
                                                </td>
                                                <td className="px-2 py-1 border">{log.duration}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}

                                    {/* Custom Fields */}
                                    {task.customFields && task.customFields.length > 0 && (
                                      <div className="mb-3">
                                        <h4 className="text-md font-medium text-gray-800">Custom Fields:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                          {task.customFields.map((field: any, fieldIdx: number) => (
                                            <li key={fieldIdx}>
                                              <span className="font-semibold">{field.key}:</span> {field.value}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksByBoardView;
