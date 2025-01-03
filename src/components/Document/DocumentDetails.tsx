// src/components/Document/DocumentDetails.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetDocumentByIdQuery,
  useDeleteDocuments3BucketMutation,
  useAddWatcherMutation,
  useRemoveWatcherMutation,
  useUpdateDocumentMutation,
  IDocument,
} from '../../api/documentApi';
import { useToast } from '../../features/Toast/ToastContext';
import Button from '../common/Button/Button';
import DocumentTagManager from './DocumentTagManager';

/**
 * This component fetches a doc by ID and allows:
 * - Viewing watchers
 * - Adding watchers
 * - Removing watchers
 * - Updating doc info (title, desc, visibility)
 * - Deleting from S3
 */
const DocumentDetails: React.FC = () => {
  const { showToast } = useToast();
  const { docId } = useParams<{ docId: string }>();

  // 1) Fetch doc by ID
  const { data: doc, error, isLoading, refetch } = useGetDocumentByIdQuery(docId!, {
    // if docId is a string
    // skip: !docId, // optional if you want to skip when docId is missing
  });

  // 2) Mutations
  const [deleteFromS3, { isLoading: deletingS3 }] = useDeleteDocuments3BucketMutation();
  const [addWatcher, { isLoading: addingWatcher }] = useAddWatcherMutation();
  const [removeWatcher, { isLoading: removingWatcher }] = useRemoveWatcherMutation();
  const [updateDoc, { isLoading: updating }] = useUpdateDocumentMutation();

  // Local form states for updating doc
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editVisibility, setEditVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');

  // Local state for adding a watcher
  const [watcherUserId, setWatcherUserId] = useState('');

  if (isLoading) {
    return <div className="p-6">Loading document details...</div>;
  }
  if (error || !doc) {
    return <div className="p-6 text-red-600">Error loading document or not found.</div>;
  }

  /**
   *  Handle watchers
   */
  const handleAddWatcher = async () => {
    if (!watcherUserId.trim()) {
      showToast('User ID is required.', 'error');
      return;
    }
    try {
      await addWatcher({ docId: doc._id, userId: watcherUserId }).unwrap();
      showToast('Watcher added!', 'success');
      setWatcherUserId('');
      refetch(); // re-fetch doc to see updated watchers
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to add watcher: ${err.data?.message || 'Unknown'}`, 'error');
    }
  };

  const handleRemoveWatcher = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this watcher?')) return;
    try {
      await removeWatcher({ docId: doc._id, userId }).unwrap();
      showToast('Watcher removed.', 'success');
      refetch();
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to remove watcher.`, 'error');
    }
  };

  /**
   * Handle doc update
   */
  const handleUpdateDoc = async () => {
    // If you want partial updates, you can do something like:
    const patch = {} as Partial<IDocument>;
    if (editTitle) patch.title = editTitle;
    if (editDesc) patch.description = editDesc;
    if (editVisibility) patch.visibility = editVisibility;

    try {
      await updateDoc({ docId: doc._id, data: patch }).unwrap();
      showToast('Document updated!', 'success');
      setEditTitle('');
      setEditDesc('');
      setEditVisibility('PRIVATE');
      refetch();
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to update: ${err.data?.message || 'Unknown'}`, 'error');
    }
  };

  /**
   * Delete from S3
   */
  const handleDeleteFromS3 = async () => {
    if (!window.confirm('Are you sure you want to delete this document from S3?')) return;
    try {
      await deleteFromS3(doc._id).unwrap();
      showToast('Document deleted from S3 successfully!', 'success');
      // Possibly navigate away or refetch if your backend also sets doc.url to something else
      refetch();
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to remove from S3.`, 'error');
    }
  };

  return (
    <div className="p-6 sidebar mx-auto space-y-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold">Document Details</h1>

      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">{doc.title}</h2>
        <p className="text-gray-600">{doc.description}</p>
        <p className="text-sm text-gray-500">Visibility: {doc.visibility}</p>
        <p className="text-sm text-gray-500">Doc ID: {doc._id}</p>
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          Open Document
        </a>
      </div>

      {/* WATCHERS SECTION */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2">Watchers</h3>
        {doc.watchers && doc.watchers.length > 0 ? (
          <ul className="list-disc ml-6 mb-3">
            {doc.watchers.map((w: any) => (
              <li key={w._id} className="flex items-center justify-between">
                <span>{w.name || w.email || w._id}</span>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleRemoveWatcher(w._id)}
                  isLoading={removingWatcher}
                  className='ml-2 mt-2'
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No watchers yet.</p>
        )}

        {/* Add Watcher */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="User ID to watch"
            value={watcherUserId}
            onChange={(e) => setWatcherUserId(e.target.value)}
            className="border p-2 rounded"
          />
          <Button onClick={handleAddWatcher} isLoading={addingWatcher}>
            Add Watcher
          </Button>
        </div>
      </div>

      {/* Add Tag */}
      <DocumentTagManager docId={doc._id} currentTags={doc.tags || []} />

      {/* UPDATE DOCUMENT SECTION */}
      <div className="border-b pb-4 space-y-2">
        <h3 className="text-lg font-semibold">Update Document</h3>
        <div>
          <label className="block text-sm text-gray-700">New Title</label>
          <input
            className="border rounded p-2 w-full"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="(optional)"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">New Description</label>
          <textarea
            className="border rounded p-2 w-full"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="(optional)"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">New Visibility</label>
          <select
            className="border rounded p-2"
            value={editVisibility}
            onChange={(e) => setEditVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <Button variant="secondary" onClick={handleUpdateDoc} isLoading={updating}>
          Update Document
        </Button>
      </div>

      {/* DELETE FROM S3 */}
      <div>
        <Button variant="danger" onClick={handleDeleteFromS3} isLoading={deletingS3}>
          Delete from S3
        </Button>
      </div>
    </div>
  );
};

export default DocumentDetails;
