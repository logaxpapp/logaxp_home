// "I want the vital message at all time."
// src/features/testManager/modals/tabs/OverviewTab.tsx

import React, { useState } from 'react';
import { ITestCase } from '../../types/testCase';
import { useUpdateTestCaseMutation } from '../../api/testCaseApi';

interface OverviewTabProps {
  testCase: ITestCase;
}

// Example sets for priority, severity, testType (adjust as needed)
const PRIORITIES = ['Low', 'Medium', 'High'] as const;
const SEVERITIES = ['Minor', 'Major', 'Critical'] as const;
const TEST_TYPES = ['Functional', 'Regression', 'Smoke', 'Performance', 'Security'] as const;

const OverviewTab: React.FC<OverviewTabProps> = ({ testCase }) => {
  const [updateTestCase] = useUpdateTestCaseMutation();

  // Existing fields
  const [feature, setFeature] = useState(testCase.feature);
  const [title, setTitle] = useState(testCase.title);
  const [description, setDescription] = useState(testCase.description || '');
  const [expectedResults, setExpectedResults] = useState(testCase.expectedResults || '');
  const [comments, setComments] = useState(testCase.comments || '');
  const [status, setStatus] = useState<ITestCase['status']>(testCase.status);

  // New fields
  const [priority, setPriority] = useState(testCase.priority || 'Medium');
  const [severity, setSeverity] = useState(testCase.severity || 'Minor');
  const [testType, setTestType] = useState(testCase.testType || 'Functional');
  const [isAutomated, setIsAutomated] = useState<boolean>(!!testCase.isAutomated);
  const [automationScriptPath, setAutomationScriptPath] = useState(
    testCase.automationScriptPath || ''
  );
  const [tags, setTags] = useState<string[]>(testCase.tags || []);

  const handleSave = async () => {
    try {
      await updateTestCase({
        id: testCase._id,
        data: {
          feature,
          title,
          description,
          expectedResults,
          comments,
          status,
          priority,
          severity,
          testType,
          isAutomated,
          // Only send path if isAutomated === true
          automationScriptPath: isAutomated ? automationScriptPath : '',
          tags,
        },
      }).unwrap();
      alert('Updated test case!');
    } catch (err) {
      console.error('Failed to update test case:', err);
      alert('Failed to update test case');
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Fields */}
      <div>
        <label className="block text-sm font-medium">Feature</label>
        <input
          className="border border-gray-300 rounded px-3 py-1 w-full"
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="border border-gray-300 rounded px-3 py-1 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          rows={3}
          className="border border-gray-300 rounded px-3 py-1 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Expected Results</label>
        <textarea
          rows={2}
          className="border border-gray-300 rounded px-3 py-1 w-full"
          value={expectedResults}
          onChange={(e) => setExpectedResults(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Comments</label>
        <textarea
          rows={2}
          className="border border-gray-300 rounded px-3 py-1 w-full"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Not Run' | 'In Progress' | 'Completed')}
        >
          <option value="Not Run">Not Run</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* New Fields */}

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium">Priority</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium">Severity</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as any)}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Test Type */}
      <div>
        <label className="block text-sm font-medium">Test Type</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={testType}
          onChange={(e) => setTestType(e.target.value as any)}
        >
          {TEST_TYPES.map((tt) => (
            <option key={tt} value={tt}>
              {tt}
            </option>
          ))}
        </select>
      </div>

      {/* isAutomated & Script Path */}
      <div>
        <label className="block text-sm font-medium mb-1">Automated?</label>
        <input
          type="checkbox"
          checked={isAutomated}
          onChange={(e) => setIsAutomated(e.target.checked)}
          className="mr-2"
        />
        <span>{isAutomated ? 'Yes' : 'No'}</span>
      </div>
      {isAutomated && (
        <div>
          <label className="block text-sm font-medium">Automation Script Path</label>
          <input
            className="border border-gray-300 rounded px-3 py-1 w-full"
            value={automationScriptPath}
            onChange={(e) => setAutomationScriptPath(e.target.value)}
            placeholder="/tests/myTest.spec.js"
          />
        </div>
      )}

      {/* Tags (comma-separated) */}
      <div>
        <label className="block text-sm font-medium">Tags</label>
        <input
          className="border border-gray-300 rounded px-3 py-1 w-full"
          placeholder="tag1, tag2, ..."
          value={tags.join(', ')}
          onChange={(e) =>
            setTags(
              e.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean) // remove empty
            )
          }
        />
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Save Changes
      </button>
    </div>
  );
};

export default OverviewTab;
