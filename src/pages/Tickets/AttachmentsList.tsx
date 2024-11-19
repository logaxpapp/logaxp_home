// src/components/Tickets/AttachmentsList.tsx

import React from 'react';
import { IAttachment } from '../../types/ticket';

interface AttachmentsListProps {
  attachments: IAttachment[];
  onAddAttachment?: (file: File) => void; // Optional: Implement adding attachments
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({ attachments, onAddAttachment }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attachments</h2>
      {attachments.length === 0 ? (
        <p className="text-gray-600">No attachments.</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {attachments.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {attachment.filename}
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* Implement Add Attachment if needed */}
      {onAddAttachment && (
        <div className="mt-4">
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onAddAttachment(e.target.files[0]);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AttachmentsList;
