// src/components/AdminReports.tsx

import React from 'react';
import AdminApprovalStatusReport from './AdminApprovalStatusReport';
import AdminAveragePerformanceReport from './AdminAveragePerformanceReport';

const AdminReports: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold mb-2 font-primary text-blue-700">Reports Dashboard</h1>
        <p className="text-gray-600 text-sm italic">Monitor key metrics and performance insights.</p>
      </header>
      </div>

      {/* Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Approval Status Report */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Approval Status Distribution</h2>
          <AdminApprovalStatusReport />
        </div>

        {/* Average Performance Report */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Average Performance Ratings</h2>
          <AdminAveragePerformanceReport />
        </div>

        {/* Placeholder for Future Reports */}
        <div className="col-span-1 md:col-span-2 bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-500 italic">More reports coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
