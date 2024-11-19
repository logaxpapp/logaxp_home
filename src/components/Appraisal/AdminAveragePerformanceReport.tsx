import React from 'react';
import { useFetchAveragePerformanceReportQuery } from '../../api/apiSlice';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { IAveragePerformanceReport } from '../../types/reports';
import { FaChartBar } from 'react-icons/fa';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminAveragePerformanceReport: React.FC = () => {
  const { data: report, error, isLoading } = useFetchAveragePerformanceReportQuery();

  const data = {
    labels: report?.map((item: IAveragePerformanceReport) => item.periodName) || [],
    datasets: [
      {
        label: 'Average Performance Rating',
        data: report?.map((item: IAveragePerformanceReport) => item.averageRating) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(37, 99, 235, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart adjusts dynamically
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Rating (0-5)',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Performance Period',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        bodyColor: '#ffffff',
        titleColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => `Rating: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-12 mx-auto max-w-screen-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <FaChartBar className="text-indigo-500 w-8 h-8" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Average Performance Ratings
            </h2>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Download Report
          </button>
        </div>

        <p className="text-gray-500 mb-6 text-center md:text-left">
          This bar chart showcases the average performance rating over time, helping you track
          performance trends across periods.
        </p>

        <div className="h-96 w-full">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading report...</p>
          ) : error ? (
            <p className="text-center text-red-500">Failed to load report.</p>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-700 mb-4 text-center md:text-left">
            Performance Summary
          </h3>
          <ul className="space-y-4">
            {report?.map((item, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <span className="text-gray-800 font-semibold">{item.periodName}</span>
                <span className="text-indigo-500 font-medium">{item.averageRating.toFixed(2)} / 5</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminAveragePerformanceReport;
