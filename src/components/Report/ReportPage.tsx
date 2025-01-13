// src/components/Report/ReportPage.tsx

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TasksByUserView from './TasksByUserView';
import TasksByStatusView from './TasksByStatusView';
import TasksByBoardView from './TasksByBoardView';
import TasksByPriorityView from './TasksByPriorityView';
import { useFetchReportByIdQuery } from '../../api/reportApi';
import { FiArrowLeft } from 'react-icons/fi';

interface ReportPageProps {}

const ReportPage: React.FC<ReportPageProps> = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract report from navigation state if available
  const state = location.state as { report: any } | undefined;
  const initialReport = state?.report;

  // If reportId is not present, handle it
  if (!reportId) {
    return (
      <div className="p-4">
        <p className="text-red-500">Report ID is missing.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FiArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  // Fetch report data only if it's not available via state
  const { data, error, isLoading } = useFetchReportByIdQuery(
    { reportId },
    { skip: !!initialReport }
  );

  const report = data || initialReport;

  if (isLoading && !report) return <p className="p-4">Loading report...</p>;
  if (error && !report) return <p className="p-4 text-red-500">Failed to load report.</p>;
  if (!report) return <p className="p-4">No report found.</p>;

  const renderReportData = () => {
    switch (report.reportType) {
      case 'TASKS_BY_USER':
        return <TasksByUserView data={report.data} />;
      case 'TASKS_BY_STATUS':
        return <TasksByStatusView data={report.data} />;
      case 'TASKS_BY_BOARD':
        return <TasksByBoardView data={report.data} />;
      case 'TASKS_BY_PRIORITY':
        return <TasksByPriorityView data={report.data} />;
      default:
        return (
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(report.data, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Reports
          </button>
        </div>
      </nav>

      {/* Report Content */}
      <main className=" mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">
            Report: {report.title || report.reportType}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Generated At: {new Date(report.generatedAt).toLocaleString()}
          </p>
          <div className="overflow-auto max-h-[70vh] bg-gray-100 p-4 rounded">
            {renderReportData()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;
