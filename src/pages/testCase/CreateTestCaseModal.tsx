// src/features/testManager/modals/CreateTestCaseModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCreateTestCaseMutation } from '../../api/testCaseApi';

// Example sets for priority, severity, testType
const PRIORITIES = ['Low', 'Medium', 'High'] as const;
const SEVERITIES = ['Minor', 'Major', 'Critical'] as const;
const TEST_TYPES = ['Functional', 'Regression', 'Smoke', 'Performance', 'Security'] as const;

interface CreateTestCaseModalProps {
  onClose: () => void;
  defaultApplication?: string;
  defaultEnvironment?: 'development' | 'staging' | 'production';
}

const CreateTestCaseModal: React.FC<CreateTestCaseModalProps> = ({
  onClose,
  defaultApplication,
  defaultEnvironment = 'development',
}) => {
  const [application, setApplication] = useState(defaultApplication || '');
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production'>(defaultEnvironment);
  const [feature, setFeature] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Medium');
  const [severity, setSeverity] = useState<typeof SEVERITIES[number]>('Minor');
  const [testType, setTestType] = useState<typeof TEST_TYPES[number]>('Functional');
  const [isAutomated, setIsAutomated] = useState(false);
  const [automationScriptPath, setAutomationScriptPath] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [createTestCase] = useCreateTestCaseMutation();

  // Re-sync local states if defaultApplication / defaultEnvironment changes
  useEffect(() => {
    if (defaultApplication) {
      setApplication(defaultApplication);
    }
    if (defaultEnvironment) {
      setEnvironment(defaultEnvironment);
    }
  }, [defaultApplication, defaultEnvironment]);

  const handleCreate = async () => {
    if (!application.trim()) {
      alert('Please provide an application name.');
      return;
    }
    if (!feature.trim() || !title.trim()) {
      alert('Please fill in at least "feature" and "title".');
      return;
    }

    try {
      await createTestCase({
        application,
        environment,
        feature,
        title,
        description,
        priority,
        severity,
        testType,
        isAutomated,
        automationScriptPath: isAutomated ? automationScriptPath : '',
        tags,
      }).unwrap();

      onClose();
    } catch (err: any) {
      console.error('Create test case failed', err);
      alert('Failed to create test case');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 top-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="relative bg-white p-6 rounded shadow-lg w-[400px] max-w-[90%] max-h-[80vh] overflow-auto"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
      >
        <h2 className="text-xl font-semibold mb-4">Create New Test Case</h2>

        {/* Application */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Application</label>
          <input
            className="border border-gray-300 rounded px-3 py-1"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="e.g. MyApp"
            disabled={!!defaultApplication}
          />
        </div>

        {/* Environment */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Environment</label>
          <select
            className="border border-gray-300 rounded px-3 py-1"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
          >
            <option value="development">development</option>
            <option value="staging">staging</option>
            <option value="production">production</option>
          </select>
        </div>

        {/* Feature */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Feature</label>
          <input
            className="border border-gray-300 rounded px-3 py-1"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
          />
        </div>

        {/* Title */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Test Case</label>
          <input
            className="border border-gray-300 rounded px-3 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 'Verify login workflow'"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Description</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-1"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Priority/Severity/TestType/IsAutomated in a 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          {/* Priority */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Priority</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
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
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Severity</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
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

          {/* TestType */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Test Type</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={testType}
              onChange={(e) => setTestType(e.target.value as any)}
            >
              {TEST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* IsAutomated toggle */}
          <div className="flex items-center gap-2 mt-6">
            <input
              id="isAutomated"
              type="checkbox"
              checked={isAutomated}
              onChange={(e) => setIsAutomated(e.target.checked)}
            />
            <label htmlFor="isAutomated" className="text-sm font-medium">
              Automated?
            </label>
          </div>
        </div>

        {/* Automation Script Path (only if isAutomated) */}
        {isAutomated && (
          <div className="flex flex-col mb-3">
            <label className="text-sm font-medium mb-1">Script Path</label>
            <input
              className="border border-gray-300 rounded px-3 py-1"
              value={automationScriptPath}
              onChange={(e) => setAutomationScriptPath(e.target.value)}
              placeholder="/tests/myTest.spec.js"
            />
          </div>
        )}

        {/* Tags (comma-separated) */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Tags</label>
          <input
            className="border border-gray-300 rounded px-3 py-1"
            placeholder="e.g. regression, login"
            value={tags.join(', ')}
            onChange={(e) =>
              setTags(
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateTestCaseModal;
