// "I want the vital message at all time."
// frontend/src/pages/PublicTestCaseShareView.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Define interfaces or types for clarity:
interface IUserRef {
  _id: string;
  name: string;
  email: string;
}

interface IAttachment {
  _id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  fileType?: string;
}

interface IRequirement {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  application?: string;
}

interface IExecution {
  executionDate: string;
  executedBy: string; // or IUserRef if populated
  actualResults: string;
  status: string; // 'Pass' | 'Fail' | 'Blocked' | 'Retest'
  comments?: string;
  recommendations?: string;
}

interface IVersion {
  versionNumber: number;
  updatedBy: string | IUserRef; // or an object if populated
  updatedAt: string;
  changes: string;
}

interface IStep {
  stepNumber: number;
  action: string;
  expected: string;
}

interface ITestCase {
  _id: string;
  testId: string;
  feature: string;
  title: string;
  status: string;
  priority: string;
  severity?: string;
  application: string;
  environment: string;
  testType?: string;       // e.g. 'Functional'
  updatedAt?: string;
  createdAt?: string;
  description?: string;
  comments?: string;
  expectedResults?: string;
  preconditions?: string[];
  tags?: string[];
  isAutomated?: boolean;
  automationScriptPath?: string;
  assignedTo?: IUserRef;
  createdBy?: IUserRef;
  steps?: IStep[];
  executions?: IExecution[];
  attachments?: IAttachment[];
  requirementIds?: IRequirement[];
  versions?: IVersion[];
}

function PublicTestCaseShareView() {
  const { token } = useParams<{ token: string }>();

  const [application, setApplication] = useState('');
  const [testCases, setTestCases] = useState<ITestCase[]>([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // To track which row (by _id) is expanded
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No token provided.');
      return;
    }

    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/public/testcases-share/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setApplication(data.application);
          setTestCases(data.testCases || []);
          setTotal(data.total || 0);
        }
      })
      .catch((err) => {
        console.error('Error fetching shared test cases:', err);
        setError('Server error');
      })
      .finally(() => setLoading(false));
  }, [token]);

  /** Toggles expanded row */
  const toggleExpand = (testCaseId: string) => {
    setExpandedRow((prev) => (prev === testCaseId ? null : testCaseId));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex  justify-center">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-lg w-full max-w-7xl p-6 relative">
        {/* Heading / Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {loading ? 'Loading...' : `Public Test Cases for ${application}`}
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          {total > 0
            ? `${total} test case${total !== 1 ? 's' : ''} found`
            : 'No test cases to display'}
        </p>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-10 w-10 animate-spin" />
          </div>
        )}

        {/* If no test cases & not loading */}
        {!loading && testCases.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-700 italic">No test cases found or link expired.</p>
          </div>
        ) : (
          <div className="overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Test ID
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Feature
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Priority
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Environment
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    TestType
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                    Last Update
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc) => {
                  const isExpanded = expandedRow === tc._id;
                  return (
                    <React.Fragment key={tc._id}>
                      {/* Main Row */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{tc.testId}</td>
                        <td className="px-4 py-2">{tc.feature}</td>
                        <td className="px-4 py-2">{tc.title}</td>
                        <td className="px-4 py-2">{tc.status}</td>
                        <td className="px-4 py-2">{tc.priority}</td>
                        <td className="px-4 py-2">{tc.environment}</td>
                        <td className="px-4 py-2">{tc.testType || '—'}</td>
                        <td className="px-4 py-2">
                          {tc.updatedAt
                            ? new Date(tc.updatedAt).toLocaleString()
                            : '—'}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => toggleExpand(tc._id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition"
                          >
                            {isExpanded ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={9} className="p-4">
                            <ExpandedTestCaseDetails testCase={tc} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Displays additional "vital" fields for a Test Case:
 *  - Severity, Application, CreatedAt
 *  - Description, Comments, ExpectedResults, Preconditions, Tags
 *  - IsAutomated, AutomationScriptPath
 *  - AssignedTo, CreatedBy
 *  - Steps, Executions, Attachments, Requirements, Versions
 */
function ExpandedTestCaseDetails({ testCase }: { testCase: ITestCase }) {
  const {
    severity,
    application,
    createdAt,
    description,
    comments,
    expectedResults,
    preconditions,
    tags,
    isAutomated,
    automationScriptPath,
    assignedTo,
    createdBy,
    steps,
    executions,
    attachments,
    requirementIds,
    versions,
  } = testCase;

  return (
    <div className="space-y-4 text-gray-700">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <InfoRow label="Severity" value={severity || '—'} />
        <InfoRow label="Application" value={application} />
        <InfoRow
          label="Created At"
          value={createdAt ? new Date(createdAt).toLocaleString() : '—'}
        />
        <InfoRow label="Is Automated?" value={isAutomated ? 'Yes' : 'No'} />
        <InfoRow
          label="Automation Script"
          value={automationScriptPath || '—'}
        />
      </div>

      {/* Assigned / Created By */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {assignedTo && (
          <InfoRow
            label="Assigned To"
            value={`${assignedTo.name} (${assignedTo.email})`}
          />
        )}
        {createdBy && (
          <InfoRow
            label="Created By"
            value={`${createdBy.name} (${createdBy.email})`}
          />
        )}
      </div>

      {/* Description */}
      {description && (
        <div>
          <h3 className="font-semibold text-gray-800">Description</h3>
          <p className="text-sm ml-2 whitespace-pre-line">{description}</p>
        </div>
      )}

      {/* Comments */}
      {comments && (
        <div>
          <h3 className="font-semibold text-gray-800">Comments</h3>
          <p className="text-sm ml-2">{comments}</p>
        </div>
      )}

      {/* Expected Results */}
      {expectedResults && (
        <div>
          <h3 className="font-semibold text-gray-800">Expected Results</h3>
          <p className="text-sm ml-2">{expectedResults}</p>
        </div>
      )}

      {/* Preconditions */}
      {preconditions && preconditions.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Preconditions</h3>
          <ul className="ml-4 list-disc text-sm">
            {preconditions.map((pc, idx) => (
              <li key={idx}>{pc}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Tags</h3>
          <div className="flex flex-wrap gap-2 ml-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {steps && steps.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Steps</h3>
          <ul className="ml-4 list-decimal text-sm">
            {steps.map((step, idx) => (
              <li key={idx} className="mb-1">
                <strong>Action:</strong> {step.action} <br />
                <em className="ml-4">Expected: {step.expected}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Executions */}
      {executions && executions.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Executions</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm mt-2">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1">Date</th>
                  <th className="px-2 py-1">Executed By</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Actual Results</th>
                  <th className="px-2 py-1">Comments</th>
                  <th className="px-2 py-1">Recommendations</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((exe, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-1">
                      {new Date(exe.executionDate).toLocaleString()}
                    </td>
                    <td className="px-2 py-1">{exe.executedBy}</td>
                    <td className="px-2 py-1">{exe.status}</td>
                    <td className="px-2 py-1">{exe.actualResults}</td>
                    <td className="px-2 py-1">{exe.comments || '—'}</td>
                    <td className="px-2 py-1">{exe.recommendations || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Attachments</h3>
          <ul className="ml-4 list-disc text-sm">
            {attachments.map((att) => (
              <li key={att._id} className="mb-1">
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {att.filename}
                </a>{' '}
                (Uploaded: {new Date(att.uploadedAt).toLocaleString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {requirementIds && requirementIds.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Requirements</h3>
          <ul className="ml-4 list-disc text-sm">
            {requirementIds.map((req) => (
              <li key={req._id} className="mb-1">
                <strong>{req.title}</strong> - {req.description}{' '}
                <em>({req.status}, {req.priority})</em>
                {req.application && <span> [App: {req.application}]</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Versions */}
      {versions && versions.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800">Versions History</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm mt-2">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1">Version #</th>
                  <th className="px-2 py-1">Updated By</th>
                  <th className="px-2 py-1">Updated At</th>
                  <th className="px-2 py-1">Changes</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((ver, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-1">{ver.versionNumber}</td>
                    <td className="px-2 py-1">
                      {typeof ver.updatedBy === 'object'
                        ? `${ver.updatedBy.name} (${ver.updatedBy.email})`
                        : ver.updatedBy}
                    </td>
                    <td className="px-2 py-1">
                      {new Date(ver.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-1 whitespace-pre-line">{ver.changes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/** A small helper to display a label + value on one row. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="font-semibold text-gray-800">{label}:</span>{' '}
      <span className="ml-1">{value}</span>
    </div>
  );
}

export default PublicTestCaseShareView;
