// src/components/DocumentTable.tsx

import React from 'react';
import { FaEye, FaDownload, FaTrash } from 'react-icons/fa';

interface TableDocument {
    id: number | string;
    title: string;
    status: string;
    date: string;
  }
  
  interface DocumentTableProps {
    documents: TableDocument[];
  }
  
  const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
    return (
      <div className="overflow-x-auto sidebar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.title}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    doc.status === 'Sent'
                      ? 'text-green-600'
                      : doc.status === 'Draft'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {doc.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" title="View Document">
                    <FaEye className="h-5 w-5" />
                  </button>
                  <button className="text-green-600 hover:text-green-800" title="Download Document">
                    <FaDownload className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Delete Document">
                    <FaTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DocumentTable;
  