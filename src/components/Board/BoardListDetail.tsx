// src/components/BoardListDetail.tsx

import React from 'react';
import {
  ICardWithListName,
  IAssignee,
  IAttachment,
  ITimeLog,
  ISubTask,
  IComment,
  ILabel,
} from '../../types/task';
import {
  FiX,
  FiDownload,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiCircle,
  FiMessageSquare,
} from 'react-icons/fi'; // Additional icons
import { format } from 'date-fns'; // For date formatting

interface BoardListDetailProps {
  card: ICardWithListName;
  onClose: () => void; // Callback to close the modal
}

const BoardListDetail: React.FC<BoardListDetailProps> = ({ card, onClose }) => {
  // Helper functions

  // Render Assignees
  const renderAssignees = (assignees: IAssignee[]) => {
    return assignees.map((assignee) => (
      <div key={assignee._id} className="flex items-center mb-2">
        <FiUser className="text-gray-500 mr-2" />
        <div>
          <p className="text-gray-800 dark:text-gray-100">{assignee.name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{assignee.email}</p>
        </div>
      </div>
    ));
  };

  // Render Attachments
  const renderAttachments = (attachments: IAttachment[]) => {
    return attachments.map((attachment) => (
      <div key={attachment._id} className="flex items-center mb-2">
        <FiDownload className="text-blue-500 mr-2" />
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {attachment.filename}
        </a>
      </div>
    ));
  };

  // Render Sub-Tasks
  const renderSubTasks = (subTasks: ISubTask[]) => {
    return subTasks.length > 0 ? (
      <ul className="list-none pl-4">
        {subTasks.map((subTask, index) => (
          <li key={index} className="flex items-center mb-1">
            {subTask.completed ? (
              <FiCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FiCircle className="text-gray-400 mr-2" />
            )}
            <span className={subTask.completed ? 'line-through text-gray-500' : ''}>
              {subTask.title}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No sub-tasks.</p>
    );
  };

  // Render Time Logs
  const renderTimeLogs = (timeLogs: ITimeLog[]) => {
    return timeLogs.length > 0 ? (
      <ul className="list-none pl-4">
        {timeLogs.map((log) => (
          <li key={log.id} className="flex items-center mb-2">
            <FiClock className="text-gray-500 mr-2" />
            <span>
              User ID: {log.user} |{' '}
              {format(new Date(log.start), 'PPpp')} -{' '}
              {log.end ? format(new Date(log.end), 'PPpp') : 'Ongoing'} (
              {log.duration ? `${log.duration} minutes` : 'Duration not logged'})
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No time logs.</p>
    );
  };

  // Render Comments
  const renderComments = (comments: IComment[]) => {
    return comments.length > 0 ? (
      <ul className="list-none pl-4">
        {comments.map((comment) => (
          <li key={comment._id} className="mb-4">
            <div className="flex items-center mb-2">
              <FiUser className="text-gray-500 mr-2" />
              <p className="text-gray-800 dark:text-gray-100">{comment._id}</p>
             
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Replies</h4>
                {renderComments(comment.replies)}
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No comments.</p>
    );
  };

  // Render Labels
  const renderLabels = (labels: ILabel[]) => {
    return labels.length > 0 ? (
      <div className="flex flex-wrap">
        {labels.map((label) => (
          <span
            key={label._id}
            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
          >
            {label.name}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No labels.</p>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-3xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          aria-label="Close Details"
        >
          <FiX size={24} />
        </button>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{card.title}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              card.priority === 'High'
                ? 'bg-red-100 text-red-800'
                : card.priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {card.priority}
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{card.description || 'No description provided.'}</p>
        </div>

        {/* Labels */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Labels</h3>
          {renderLabels(card.labels)}
        </div>

        {/* Assignees */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Assignees</h3>
          {card.assignees.length > 0 ? (
            <div className="flex flex-wrap">
              {card.assignees.map((assignee) => (
                <div key={typeof assignee === 'string' ? assignee : assignee._id} className="flex items-center mr-4 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                    <FiUser className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-100">
                      {typeof assignee === 'string' ? 'Unknown Assignee' : assignee.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {typeof assignee === 'string' ? 'No email provided' : assignee.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No assignees.</p>
          )}
        </div>

        {/* Status and List */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Status</h3>
            <p className="text-gray-600 dark:text-gray-300">{card.status}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">List</h3>
            <p className="text-gray-600 dark:text-gray-300">{card.listName}</p>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Attachments</h3>
          {card.attachments.length > 0 ? (
            <div className="flex flex-col">
              {renderAttachments(card.attachments)}
            </div>
          ) : (
            <p className="text-gray-500">No attachments.</p>
          )}
        </div>

        {/* Sub-Tasks */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Sub-Tasks</h3>
          {renderSubTasks(card.subTasks ?? [])}
        </div>

        {/* Time Logs */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Time Logs</h3>
          {renderTimeLogs(card.timeLogs ?? [])}
        </div>

        {/* Comments */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Comments</h3>
          {renderComments(card.comments ?? [])}
        </div>

        {/* Additional Information */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Created At</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {format(new Date(card.createdAt), 'PPpp')}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Updated At</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {format(new Date(card.updatedAt), 'PPpp')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardListDetail;
