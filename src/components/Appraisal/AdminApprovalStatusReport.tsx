// src/components/AdminApprovalStatusReport.tsx

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
        borderColor: '#ffffff', // White border for better segment separation
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#374151', // Text color for labels
          font: {
            size: 14,
          },
          padding: 20,
          boxWidth: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)', // Dark background for tooltip
        bodyColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        titleFont: { weight: 'bold' as const }, // Use "bold" instead of generic string
        bodyFont: { size: 16 },
      },
    },
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 lg:max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaChartPie className="text-indigo-500 w-8 h-8" />
            <h2 className="text-3xl font-semibold text-gray-800">Approval Status Distribution</h2>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Download Report
          </button>
        </div>

        <p className="text-gray-500 mb-8">
          This chart provides an overview of the distribution of approval statuses, giving insights into the overall workflow efficiency.
        </p>

        <div className="flex justify-center">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading report...</p>
          ) : error ? (
            <p className="text-center text-red-500">Failed to load report.</p>
          ) : (
            <Pie data={data} options={options} />
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Report Summary</h3>
          <ul className="space-y-4">
            {report?.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
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
