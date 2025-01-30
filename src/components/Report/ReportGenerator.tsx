import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { ReportType } from '../../types/report';
import {
  IGenerateReportInput,
  useGenerateReportMutation,
} from '../../api/reportApi';
import { useToast } from '../../features/Toast/ToastContext';
import { FiDownload } from 'react-icons/fi';
import AnimatedButton from '../../components/common/Button/AnimatedButton';

const ReportGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentUser = useAppSelector(selectCurrentUser);

  // Form states
  const [reportType, setReportType] = useState<ReportType>(ReportType.TASKS_BY_STATUS);
  const [boardId, setBoardId] = useState('');
  const [listId, setListId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Toast and RTK Mutation
  const { showToast } = useToast();
  const [generateReport, { isLoading, data }] = useGenerateReportMutation();

  // Populate form state from query params on mount
  useEffect(() => {
    const boardIdQuery = searchParams.get('boardId') || '';
    const listIdQuery = searchParams.get('listId') || '';
    const statusQuery = searchParams.get('status') || '';
    const priorityQuery = searchParams.get('priority') || '';
    const startDateQuery = searchParams.get('startDate') || '';
    const endDateQuery = searchParams.get('endDate') || '';

    setBoardId(boardIdQuery);
    setListId(listIdQuery);
    setStatus(statusQuery);
    setPriority(priorityQuery);
    setStartDate(startDateQuery);
    setEndDate(endDateQuery);
  }, [searchParams]);

  // Auto-fill userId if logged in
  useEffect(() => {
    if (currentUser?._id) {
      setUserId(currentUser._id);
    }
  }, [currentUser]);

  /**
   * Handle Report Generation
   */
  const handleGenerate = async () => {
    const input: IGenerateReportInput = {
      reportType,
      boardId: boardId || undefined,
      listId: listId || undefined,
      userId: userId || undefined,
      status: status || undefined,
      priority: priority || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      await generateReport(input).unwrap();
      showToast('Report generated successfully', 'success');
    } catch (err: any) {
      showToast(err?.data?.error || 'Failed to generate report', 'error');
    }
  };

  /**
   * Export the Generated Report as JSON
   */
  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.title}_${new Date().toISOString()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Generate Report</h1>
          <p className="text-blue-100 text-sm md:text-base mt-1">
            Quickly create customized task or project reports
          </p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ========== LEFT COLUMN: Form & Generate Button ========== */}
          <motion.div
            className="flex flex-col space-y-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Report Type */}
            <div>
              <label className="block font-medium mb-2">Report Type</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                {Object.values(ReportType).map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            {/* Board ID */}
            <div>
              <label className="block font-medium mb-2">Board ID</label>
              <input
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                type="text"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                placeholder="Optional"
              />
            </div>

            {/* List ID */}
            <div>
              <label className="block font-medium mb-2">List ID</label>
              <input
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                type="text"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                placeholder="Optional"
              />
            </div>

            {/* User ID (auto-populated) */}
            <div>
              <label className="block font-medium mb-2">User ID</label>
              <input
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-medium mb-2">Status</label>
              <input
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="E.g. 'Open', 'In Progress'..."
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block font-medium mb-2">Priority</label>
              <input
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                type="text"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="E.g. 'High', 'Low'..."
              />
            </div>

            {/* Dates */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Start Date</label>
                <input
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium mb-2">End Date</label>
                <input
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-center space-x-2 pt-4">
              <AnimatedButton
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </AnimatedButton>

              {data && (
                <AnimatedButton
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700"
                  Icon={FiDownload}
                >
                  Export
                </AnimatedButton>
              )}
            </div>
          </motion.div>

          {/* ========== RIGHT COLUMN: Report Preview ========== */}
          <motion.div
            className="bg-gray-50 p-4 rounded-lg shadow-inner overflow-auto"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {data ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Report: {data.title}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Generated At: {new Date(data.generatedAt || '').toLocaleString()}
                </p>
                <pre className="bg-white p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(data.data, null, 2)}
                </pre>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  className="w-16 h-16 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v2h6v-2m-3-1.5V7M5 12h2m10 0h2M3 8h2m10 0h2m-7 4h.01m0 4h.01M14 8h.01m0 4h.01"
                  />
                </svg>
                <p className="text-center text-sm">
                  Your generated report will appear here once ready.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportGenerator;
