import React, { useState, useEffect } from 'react';
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

const ReportGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Grab the logged-in user from Redux
  const currentUser = useAppSelector(selectCurrentUser);

  // Local states
  const [reportType, setReportType] = useState<ReportType>(ReportType.TASKS_BY_STATUS);
  const [boardId, setBoardId] = useState('');
  const [listId, setListId] = useState('');
  const [userId, setUserId] = useState(''); // We'll auto-fill this with currentUser?._id
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { showToast } = useToast();
  const [generateReport, { isLoading, data }] = useGenerateReportMutation();

  // On mount, read query params & fill state
  useEffect(() => {
    const boardIdQuery = searchParams.get('boardId') || '';
    const listIdQuery = searchParams.get('listId') || '';
    // We won't rely on userId from searchParams, because we prefer the Redux store
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

  // If currentUser is available, auto-fill userId
  useEffect(() => {
    if (currentUser?._id) {
      setUserId(currentUser._id);
    }
  }, [currentUser]);

  /**
   * Generate Report Handler
   */
  const handleGenerate = async () => {
    const input: IGenerateReportInput = {
      reportType,
      boardId: boardId || undefined,
      listId: listId || undefined,
      userId: userId || undefined,       // auto-populated from Redux
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
   * Export as JSON
   */
  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.title}_${new Date().toISOString()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-4 md:p-8 text-gray-800 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Generate Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report Type */}
        <div>
          <label className="block font-medium">Report Type</label>
          <select
            className="w-full p-2 border rounded mt-1"
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
          <label className="block font-medium">Board ID</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="text"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
          />
        </div>

        {/* List ID */}
        <div>
          <label className="block font-medium">List ID</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="text"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
          />
        </div>

        {/* User ID (auto-populated) */}
        <div>
          <label className="block font-medium">User ID</label>
          <input
            className="w-full p-2 border rounded mt-1 bg-gray-100"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled // or remove `disabled` if you want them to override
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block font-medium">Priority</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="text"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-medium">End Date</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>

        {data && (
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
          >
            <FiDownload />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Display Generated Report Data */}
      {data && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold">Report: {data.title}</h2>
          <p className="text-sm text-gray-600">
            Generated At: {new Date(data.generatedAt || '').toLocaleString()}
          </p>
          <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
            {JSON.stringify(data.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
