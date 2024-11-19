import React from 'react';
import { useFetchApprovalStatusReportQuery } from '../../api/apiSlice';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { IAppraisalStatusReport } from '../../types/reports';
import { FaChartPie } from 'react-icons/fa';

Chart.register(ArcElement, Tooltip, Legend);

const AdminApprovalStatusReport: React.FC = () => {
  const { data: report, error, isLoading } = useFetchApprovalStatusReportQuery();

  // Log report data to see if it’s correctly populated
  console.log('Approval Status Report:', report);

  const data = {
    labels: report?.map((item: IAppraisalStatusReport) => item.status) || [],
    datasets: [
      {
        data: report?.map((item: IAppraisalStatusReport) => item.count) || [],
        backgroundColor: ['#facc15', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#9ca3af'],
        hoverBackgroundColor: ['#fde047', '#34d399', '#f87171', '#60a5fa', '#a78bfa', '#d1d5db'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#374151',
          font: {
            size: 14,
          },
          padding: 20,
          boxWidth: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        bodyColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        titleFont: { weight: 'bold' as const },
        bodyFont: { size: 16 },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-12 mx-auto max-w-screen-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <FaChartPie className="text-indigo-500 w-8 h-8" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Approval Status Distribution
            </h2>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Download Report
          </button>
        </div>

        <p className="text-gray-500 mb-6 text-center md:text-left">
          This chart provides an overview of the distribution of approval statuses, giving insights
          into the overall workflow efficiency.
        </p>

        <div className="h-96 w-full">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading report...</p>
          ) : error ? (
            <p className="text-center text-red-500">Failed to load report.</p>
          ) : (
            <Pie data={data} options={options} />
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-700 mb-4 text-center md:text-left">
            Report Summary
          </h3>
          <ul className="space-y-4">
            {report?.map((item, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                  ></div>
                  <span className="text-gray-800 font-semibold">{item.status}</span>
                </div>
                <span className="text-gray-600">{item.count} Requests</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovalStatusReport;
