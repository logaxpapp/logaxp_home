// "I want the vital message at all time."
// src/features/requirements/RequirementManager.tsx

import React, { useState } from 'react';
import {
  useFetchAllRequirementsQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
} from '../../api/requirementApi';
import { useLinkRequirementMutation, useUnlinkRequirementMutation } from '../../api/testCaseApi';
import { IRequirement } from '../../types/requirement';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaLink } from 'react-icons/fa';

import { LinkToTestCaseModal } from './LinkToTestCaseModal';
import { EditRequirementModal } from './EditRequirementModal';
import { CreateRequirementModal } from './CreateRequirementModal';

// Reuse the same applications array
import { APPLICATIONS } from '../../types/requirement';

interface RequirementManagerProps {
  defaultPageSize?: number;
}

const RequirementManager: React.FC<RequirementManagerProps> = ({
  defaultPageSize = 10,
}) => {
  // For "Filter by application"
  const [selectedApplication, setSelectedApplication] = useState<string>('');

  // Basic states for search, pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(defaultPageSize);

  // For modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<IRequirement | null>(null);
  const [linkingRequirement, setLinkingRequirement] = useState<IRequirement | null>(null);

  // Requirements RTK Query
  // Pass { application: selectedApplication } if user chooses one, or pass undefined if empty
  const applicationQueryArg = selectedApplication
    ? { application: selectedApplication }
    : undefined;

  // We call the query with the optional argument
  const { data, isLoading, isError, refetch } = useFetchAllRequirementsQuery(
    applicationQueryArg
  );

  const [createRequirement] = useCreateRequirementMutation();
  const [updateRequirement] = useUpdateRequirementMutation();
  const [deleteRequirement] = useDeleteRequirementMutation();

  const [linkRequirementToTestCase] = useLinkRequirementMutation();
  const [unlinkRequirementFromTestCase] = useUnlinkRequirementMutation();

  // Derived data
  const allRequirements = data?.requirements || [];

  // Filter or search locally by title or description
  const filteredReqs = allRequirements.filter((req) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      req.title.toLowerCase().includes(lowerSearch) ||
      (req.description && req.description.toLowerCase().includes(lowerSearch))
    );
  });

  // Basic pagination approach
  const total = filteredReqs.length;
  const totalPages = Math.ceil(total / limit);
  const displayedReqs = filteredReqs.slice((page - 1) * limit, page * limit);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleApplicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApplication(e.target.value);
    setPage(1); // reset pagination
  };

  const handleDelete = async (reqId: string) => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) return;
    try {
      await deleteRequirement(reqId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete requirement:', err);
      alert('Delete failed.');
    }
  };

  const handleCreate = async (input: Partial<IRequirement>) => {
    try {
      // Ensure 'application' is included (the modal will handle it)
      await createRequirement(input).unwrap();
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Create requirement failed', err);
      alert('Failed to create requirement');
    }
  };

  const handleUpdate = async (reqId: string, updates: Partial<IRequirement>) => {
    try {
      await updateRequirement({ id: reqId, data: updates }).unwrap();
      setEditingRequirement(null);
      refetch();
    } catch (err) {
      console.error('Update requirement failed', err);
      alert('Failed to update requirement');
    }
  };

  const handleLink = async (testCaseId: string, requirementId: string) => {
    try {
      await linkRequirementToTestCase({ testCaseId, requirementId }).unwrap();
      setLinkingRequirement(null);
      alert('Linked requirement to test case successfully!');
    } catch (err) {
      console.error('Link requirement => test case failed', err);
      alert('Linking requirement failed.');
    }
  };

  const handleUnlink = async (testCaseId: string, requirementId: string) => {
    try {
      await unlinkRequirementFromTestCase({ testCaseId, requirementId }).unwrap();
      setLinkingRequirement(null);
      alert('Unlinked requirement from test case successfully!');
    } catch (err) {
      console.error('Unlink requirement => test case failed', err);
      alert('Unlinking requirement failed.');
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded min-h-screen">
      <h2 className="text-xl font-bold mb-4">Requirement Manager</h2>

      {/* Filter by Application */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-semibold">Application:</label>
        <select
          value={selectedApplication}
          onChange={handleApplicationChange}
          className="border px-6 py-1 rounded"
        >
          <option value="">-- All Applications --</option>
          {APPLICATIONS.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>
      </div>

      {/* Search & Create actions row */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center space-x-2 border rounded px-2 py-1">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search requirements..."
            className="outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Requirement</span>
        </button>
      </div>

      {/* Table */}
      {isLoading && <p>Loading requirements...</p>}
      {isError && <p className="text-red-500">Error loading requirements.</p>}
      {!isLoading && !isError && displayedReqs.length === 0 && (
        <p className="text-gray-500">No requirements found for this filter.</p>
      )}
      {!isLoading && !isError && displayedReqs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Priority</th>
                <th className="border px-4 py-2 text-left">Application</th>
                <th className="border px-4 py-2 text-left">CreatedBy</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedReqs.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{req.title}</td>
                  <td className="border px-4 py-2">{req.status}</td>
                  <td className="border px-4 py-2">{req.priority}</td>
                  <td className="border px-4 py-2">{req.application}</td>
                  <td className="border px-4 py-2 text-sm">
                    {typeof req.createdBy === 'object' && req.createdBy !== null
                      ? `${req.createdBy.name ?? ''} (${req.createdBy.email ?? ''})`
                      : 'N/A'}
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => setEditingRequirement(req)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => setLinkingRequirement(req)}
                      className="text-green-600 hover:text-green-800"
                      title="Link requirement to a test case"
                    >
                      <FaLink />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <CreateRequirementModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          defaultApplication={selectedApplication} // pass the currently chosen app if you like
        />
      )}

      {/* EDIT MODAL */}
      {editingRequirement && (
        <EditRequirementModal
          requirement={editingRequirement}
          onClose={() => setEditingRequirement(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* LINK-TO-TEST-CASE MODAL */}
      {linkingRequirement && (
        <LinkToTestCaseModal
          requirement={linkingRequirement}
          onClose={() => setLinkingRequirement(null)}
          onLink={handleLink}
          onUnlink={handleUnlink}
        />
      )}

      <div className="text-xs text-gray-500 italic mt-4">
        <strong>Vital message:</strong> Ensure you keep the requirement’s application 
        consistent with the test case’s application if you plan to link them.
      </div>
    </div>
  );
};

export default RequirementManager;
