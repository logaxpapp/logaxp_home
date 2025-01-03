// src/components/Document/DocumentManager.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useFetchAllDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from '../../api/documentApi';
import { DocumentVisibility } from '../../api/documentApi';
import Pagination from '../common/Pagination/Pagination';
import Button from '../common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * An awesome DocumentManager component with:
 * - Collapsible "Upload New Document" section
 * - Link to ProtectedDocumentManager
 * - Paginated document list
 * - Filtering by visibility
 */
const DocumentManager: React.FC = () => {
  const { showToast } = useToast();

  // States for pagination & visibility filter
  const [skip, setSkip] = useState<number>(0);
  const limit = 10;
  const [filterVisibility, setFilterVisibility] = useState<'ALL' | DocumentVisibility>('ALL');
  const [filterCategory, setFilterCategory] = useState('');
  const [category, setCategory] = useState('');

  // Fetch documents from RTK Query
  const { data, error, isLoading, refetch } = useFetchAllDocumentsQuery({
    skip,
    limit,
    visibility: filterVisibility === 'ALL' ? undefined : filterVisibility,
    category: filterCategory || undefined,
  });

  // Upload & Delete mutations
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<DocumentVisibility>('PRIVATE');
  const [file, setFile] = useState<File | null>(null);

  // Collapsible panel state
  const [uploadPanelOpen, setUploadPanelOpen] = useState<boolean>(false);

  /** Handle upload */
  const handleUpload = async () => {
    if (!title.trim() || !file) {
      showToast('Please enter a title and select a file.', 'error');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('visibility', visibility);
      formData.append('attachment', file);
  
      // Category
      if (category) {
        formData.append('category', category);
      }
  
      await uploadDocument(formData).unwrap();
      showToast('Document uploaded successfully!', 'success');
  
      // Reset
      setTitle('');
      setDescription('');
      setVisibility('PRIVATE');
      setCategory('');
      setFile(null);
  
      // Refresh
      refetch();
    } catch (err) {
      console.error(err);
      showToast('Failed to upload the document.', 'error');
    }
  };

  /** Handle delete */
  const handleDelete = async (docId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (!confirmed) return;

    try {
      await deleteDocument(docId).unwrap();
      showToast('Document deleted successfully.', 'success');
      refetch();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete the document.', 'error');
    }
  };

  // Documents & pagination
  const documents = data?.documents || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const currentPage = skip / limit + 1;
  const onPageChange = (pageNumber: number) => {
    setSkip((pageNumber - 1) * limit);
  };

  // Toggle the upload panel
  const toggleUploadPanel = () => {
    setUploadPanelOpen(!uploadPanelOpen);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md mx-auto min-h-screen space-y-6 sidebar">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Document Manager</h1>
        {/* Link to Protected Document Manager */}
        <Link
          to="/dashboard/documents/protected"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Protected Docs
        </Link>
      </div>

      {/* Collapsible Upload Section */}
      <div className="border rounded-md shadow-sm bg-gray-50">
        {/* Toggle header */}
        <Button
          onClick={toggleUploadPanel}
          className="w-full flex items-center justify-between px-4 py-3 text-left 
                     bg-gray-200 hover:bg-gray-300 transition rounded-t-md"
        >
          <span className="">Upload New Document</span>
          {uploadPanelOpen ? (
            <FiChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <FiChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </Button>

        {/* Panel Content */}
        {uploadPanelOpen && (
          <div className="p-4 space-y-4 border-t">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  className="w-full p-2 border rounded"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as DocumentVisibility)}
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
            className="w-full p-2 border rounded"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            >
            <option value="">-- None --</option>
            <option value="Invoices">Invoices</option>
            <option value="Contracts">Contracts</option>
            <option value="Design Docs">Design Docs</option>
            {/* Add more as needed */}
            </select>
        </div>

            {/* File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <Button variant="secondary" onClick={handleUpload} isLoading={isUploading}>
              Upload
            </Button>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by Visibility:</label>
        <select
          className="border p-2 px-4 rounded "
          value={filterVisibility}
          onChange={(e) => {
            setFilterVisibility(e.target.value as 'ALL' | DocumentVisibility);
            setSkip(0);
          }}
        >
          <option value="ALL">All</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Document List */}
      {isLoading ? (
        <p className="text-gray-600">Loading documents...</p>
      ) : error ? (
        <p className="text-red-600">Error loading documents.</p>
      ) : (
        <div>
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents found.</p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-4 bg-gray-50 rounded shadow-sm flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                    <p className="text-gray-600">{doc.description}</p>
                    <p className="text-sm text-gray-500">
                      Visibility: <span className="font-medium">{doc.visibility}</span>
                    </p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm mr-4"
                    >
                      Open Document
                    </a>
                    <Link
                      to={`/dashboard/documents/${doc._id}/details`}  //documents/:docId/details
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="flex flex-shrink-0 items-center space-x-2">
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(doc._id)}
                      isLoading={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
