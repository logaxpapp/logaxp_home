import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateTestCaseMutation } from '../../api/testCaseApi';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';


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
  const [error, setError] = useState<string | null>(null);

  const [createTestCase, { isLoading }] = useCreateTestCaseMutation();

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
      setError('Please provide an application name.');
      return;
    }
    if (!feature.trim() || !title.trim()) {
      setError('Please fill in at least "feature" and "title".');
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
      setError('Failed to create test case');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 top-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[500px] max-w-[90%] max-h-[90vh] overflow-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">Create New Test Case</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Application */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Application</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                placeholder="e.g. MyApp"
                disabled={!!defaultApplication}
              />
            </div>

            {/* Environment */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Environment</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
              >
                <option value="development">development</option>
                <option value="staging">staging</option>
                <option value="production">production</option>
              </select>
            </div>

            {/* Feature */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Feature</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Test Case</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 'Verify login workflow'"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Description</label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Priority/Severity/TestType/IsAutomated in a 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Priority</label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
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
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Severity</label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
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
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Test Type</label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isAutomated" className="text-sm font-medium dark:text-gray-200">
                  Automated?
                </label>
              </div>
            </div>

            {/* Automation Script Path (only if isAutomated) */}
            {isAutomated && (
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Script Path</label>
                <input
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  value={automationScriptPath}
                  onChange={(e) => setAutomationScriptPath(e.target.value)}
                  placeholder="/tests/myTest.spec.js"
                />
              </div>
            )}

            {/* Tags (comma-separated) */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Tags</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
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
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  Create
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateTestCaseModal;