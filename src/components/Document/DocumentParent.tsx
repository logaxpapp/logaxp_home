// src/pages/DocumentParent.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store'; // Adjust the path based on your project structure
import SentDocuments from './SentDocuments';
import DocumentManager from './DocumentManager';
import DocumentTable from './DocumentTable';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useFetchAllDocumentsQuery } from '../../api/documentApi'; // Import the fetchDocuments query
import { useToast } from '../../features/Toast/ToastContext';

interface TableDocument {
    id: number | string;
    title: string;
    status: string;
    date: string;
  }

/**
 * DocumentParent Page with colorful, animated tabs and a responsive layout.
 */
const DocumentParent: React.FC = () => {
  // Get logged-in user from Redux state
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch documents using RTK Query
  const { data: documentsData, isLoading, error } = useFetchAllDocumentsQuery({
    skip: 0,       // Optional: Pagination start index
    limit: 1000,   // Optional: Number of documents to fetch
   
    category: 'general',  // Optional: Category filter
  });
  

  // Initialize toast notifications
  const { showToast } = useToast();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-3 text-blue-600 text-lg">Loading...</span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('Error fetching documents:', error);
    showToast('Failed to load documents.', 'error');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error loading documents. Please try again later.</p>
      </div>
    );
  }

  // Handle direct array or structured response
  const documents = Array.isArray(documentsData) ? documentsData : documentsData?.documents || [];

  // If you still want to use mock data when documents are empty
  const mockDocuments = [
    { id: 1, title: 'Document 1', status: 'Sent', date: '2023-10-01' },
    { id: 2, title: 'Document 2', status: 'Draft', date: '2023-10-02' },
    { id: 3, title: 'Document 3', status: 'Received', date: '2023-10-03' },
    { id: 4, title: 'Document 4', status: 'Sent', date: '2023-10-04' },
    { id: 5, title: 'Document 5', status: 'Draft', date: '2023-10-05' },
  ];

  const allDocuments = documents.length > 0 ? documents : mockDocuments;

  // Map documents to the expected shape
  const mappedDocuments: TableDocument[] = allDocuments.map((doc: any) => ({
    id: doc._id || doc.id || 0,
    title: doc.title || 'Untitled',
    status: doc.status || 'Unknown',
    date: doc.date || new Date().toISOString().split('T')[0],
  }));
  

  // Filter documents by status
  const sentDocuments = allDocuments.filter((doc: any) => doc.status === 'Sent');
  const draftDocuments = allDocuments.filter((doc: any) => doc.status === 'Draft');
  const receivedDocuments = allDocuments.filter((doc: any) => doc.status === 'Received');

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-gray-600">Please log in to view your documents.</p>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Tabs className="react-tabs w-full mx-auto">
        {/* TAB LIST */}
        <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 text-base font-medium">
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-blue-100 to-blue-50 
                         text-blue-600 rounded-t-md hover:from-blue-200 hover:to-blue-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Overview
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-green-100 to-green-50 
                         text-green-700 rounded-t-md hover:from-green-200 hover:to-green-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Sent Documents
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-purple-100 to-purple-50
                         text-purple-600 rounded-t-md hover:from-purple-200 hover:to-purple-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Document Manager
          </Tab>
          <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-gradient-to-r from-yellow-100 to-yellow-50
                         text-yellow-700 rounded-t-md hover:from-yellow-200 hover:to-yellow-100 transition-all 
                         duration-300 ease-in-out outline-none">
            Document Table
          </Tab>
        </TabList>

        {/* TAB PANELS */}
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-blue-700">Total Documents</h2>
              <p className="text-3xl font-bold text-blue-900">{allDocuments.length}</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-green-700">Sent Documents</h2>
              <p className="text-3xl font-bold text-green-900">{sentDocuments.length}</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-yellow-700">Draft Documents</h2>
              <p className="text-3xl font-bold text-yellow-900">{draftDocuments.length}</p>
            </div>
          </div>

          {/* Optionally, you can add more overview content here */}
        </TabPanel>
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <SentDocuments />
        </TabPanel>
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <DocumentManager />
        </TabPanel>
        <TabPanel className="react-tabs__tab-panel p-4 bg-white rounded-b-md shadow">
          <h2 className="text-2xl font-bold mb-4">All Documents</h2>
          <DocumentTable documents={mappedDocuments} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DocumentParent;
