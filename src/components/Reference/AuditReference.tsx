// src/components/AuditReference.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAuditReferenceQuery } from '../../api/referenceApi';

/** Format a date string or Date object into a human-readable format */
const formatValue = (value: string | Date | undefined) => {
  if (!value) return '—'; // No value at all
  // If it's already a Date object, convert to string; if it's a string, parse it.
  const dateObj = value instanceof Date ? value : new Date(value);
  // Check if it's a valid date (NaN check)
  if (isNaN(dateObj.getTime())) {
    return value?.toString() || '—'; // Not a valid date, just return the raw value
  }
  // Otherwise, format nicely (e.g., Sep 3, 2024, 12:00 AM)
  return dateObj.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const AuditReference: React.FC = () => {
  const { referenceId } = useParams<{ referenceId: string }>();
  const navigate = useNavigate();

  console.log('referenceId:', referenceId);

  const { data, isLoading, isError, error } = useGetAuditReferenceQuery(referenceId || '');

  console.log('audit data:', data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-600">Loading audit data...</p>
      </div>
    );
  }

  if (isError) {
    const errMsg = (error as any)?.data?.message || 'Failed to load.';
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-md">
        Error: {errMsg}
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-700">No audit data found.</p>;
  }

  const { comparison } = data;

  return (
    <div className="mx-auto p-6 md:min-h-screen bg-white rounded-lg shadow-md">
      {/* Return / Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Audit for Reference: 
        <span className="text-blue-600"> 
        {String(comparison.name.fromReferee ?? '')}
        </span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-3 font-semibold tracking-wider">Field</th>
              <th className="px-4 py-3 font-semibold tracking-wider">Referee Table</th>
              <th className="px-4 py-3 font-semibold tracking-wider">Reference Table</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(comparison).map(([fieldName, { fromReferee, fromReference }]) => {
              // Attempt to parse and format each side if it's a valid date
              let leftValue = String(fromReferee ?? '—');
              let rightValue = String(fromReference ?? '—');

              const parsedLeft = new Date(leftValue);
              if (!isNaN(parsedLeft.getTime())) {
                leftValue = formatValue(parsedLeft);
              }

              const parsedRight = new Date(rightValue);
              if (!isNaN(parsedRight.getTime())) {
                rightValue = formatValue(parsedRight);
              }

              return (
                <tr key={fieldName} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 capitalize">
                    {fieldName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{leftValue}</td>
                  <td className="px-4 py-3 text-gray-700">{rightValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditReference;
