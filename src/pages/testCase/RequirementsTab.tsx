// "I want the vital message at all time."
// src/features/testManager/modals/tabs/RequirementsTab.tsx

import React, { useState, useMemo } from 'react';
import { ITestCase } from '../../types/testCase';
import { useFetchAllRequirementsQuery } from '../../api/requirementApi'; 
import {
  useLinkRequirementMutation,
  useUnlinkRequirementMutation,
} from '../../api/testCaseApi';

interface RequirementsTabProps {
  testCase: ITestCase;
}

const RequirementsTab: React.FC<RequirementsTabProps> = ({ testCase }) => {
  // 1) Only fetch requirements belonging to the same application as this testCase
  const { data: reqData, isLoading: reqLoading, isError } = useFetchAllRequirementsQuery({
    application: testCase.application,
  });

  const [linkReq] = useLinkRequirementMutation();
  const [unlinkReq] = useUnlinkRequirementMutation();

  

  // For searching unlinked requirements
  const [searchTerm, setSearchTerm] = useState('');

  // 2) All Requirements from the API (already filtered by application on the backend)
  const allRequirements = reqData?.requirements || [];

  // 3) The testCase might store requirementIds as objects or strings
  const linkedRequirements = testCase.requirementIds || [];

  // 4) Build a Set of the linked requirement IDs
  const linkedRequirementIdsSet = useMemo(
    () => new Set(linkedRequirements.map((r: any) => (typeof r === 'string' ? r : r._id))),
    [linkedRequirements]
  );

  console.log('Linked Requirement IDs:', linkedRequirementIdsSet);

  // 5) Derive which are unlinked
  const unlinkedRequirements = allRequirements.filter(
    (req) => !linkedRequirementIdsSet.has(req._id)
  );

  // 6) Local search filter on the unlinked requirements
  const filteredUnlinkedRequirements = useMemo(() => {
    if (!searchTerm.trim()) return unlinkedRequirements;
    const lowerSearch = searchTerm.toLowerCase();
    return unlinkedRequirements.filter((req) =>
      req.title.toLowerCase().includes(lowerSearch) ||
      (req.description && req.description.toLowerCase().includes(lowerSearch))
    );
  }, [unlinkedRequirements, searchTerm]);

  console.log('Unlinked Requirements:', filteredUnlinkedRequirements);

  // Handlers
  const handleLink = async (reqId: string) => {
    try {
      await linkReq({ testCaseId: testCase._id, requirementId: reqId }).unwrap();
      // If your backend returns an updated TestCase, you could refresh or rely on tags
    } catch (err) {
      console.error('Error linking requirement:', err);
      alert('Failed to link requirement');
    }
  };

  const handleUnlink = async (reqId: string) => {
    try {
      await unlinkReq({ testCaseId: testCase._id, requirementId: reqId }).unwrap();
      // If your backend returns an updated TestCase, you could refresh or rely on tags
    } catch (err) {
      console.error('Error unlinking requirement:', err);
      alert('Failed to unlink requirement');
    }
  };

  // 7) Handle loading / error states
  if (reqLoading) {
    return <p className="text-gray-500">Loading requirements...</p>;
  }
  if (isError) {
    return <p className="text-red-500">Error loading requirements.</p>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Requirements</h3>

      {/* Linked Requirements */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Linked Requirements</h4>
        {linkedRequirements.length === 0 ? (
          <p className="text-sm text-gray-400 mb-2">No requirements linked yet.</p>
        ) : (
          <table className="min-w-full text-sm mb-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Priority</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
            {linkedRequirements.map((linked: any) => {
                    const keyValue = typeof linked === 'string' ? linked : linked._id;
                    return (
                    <tr key={keyValue} className="border-b">
                    <td className="px-3 py-2">{linked.title}</td>
                    <td className="px-3 py-2">{linked.status || ''}</td>
                    <td className="px-3 py-2">{linked.priority || ''}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleUnlink(linked._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Unlink
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Unlinked Requirements */}
      <div>
        <h4 className="font-semibold mb-2">Unlinked Requirements</h4>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
        </div>

        {filteredUnlinkedRequirements.length === 0 ? (
          <p className="text-sm text-gray-400 mb-2">No unlinked requirements found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Priority</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredUnlinkedRequirements.map((req) => (
                <tr key={req._id} className="border-b">
                  <td className="px-3 py-2">{req.title}</td>
                  <td className="px-3 py-2">{req.status}</td>
                  <td className="px-3 py-2">{req.priority}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleLink(req._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vital Message */}
      <div className="text-xs text-gray-500 italic mt-4">
        <strong>Vital message:</strong> By passing <code>{`{ application: testCase.application }`}</code>
        to <strong>useFetchAllRequirementsQuery</strong>, you only display Requirements from the
        same application as this TestCase!
      </div>
    </div>
  );
};

export default RequirementsTab;
