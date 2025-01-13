// src/pages/ReportManagement.tsx

import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ReportGenerator from './ReportGenerator';
import ReportList from './ReportList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ReportManagement: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  // e.g. from "?boardId=123"
  const [searchParams] = useSearchParams();
  const boardIdParam = searchParams.get('boardId') || '';

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <button
        onClick={handleBack}
        className="flex items-center bg-green-100 text-gray-600 px-4 py-2 
                   rounded-md hover:bg-green-300 hover:text-white 
                   transition-colors mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>

      <Tabs>
        <TabList className="flex space-x-2 border-b mb-4">
          <Tab className="px-4 py-2 cursor-pointer bg-blue-100 
                         text-blue-800 rounded-t-md">
            Generate Report
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer bg-green-100 
                         text-green-800 rounded-t-md">
            Report List
          </Tab>
        </TabList>

        <TabPanel className="p-4 bg-white rounded-b-md shadow">
          {/* We can pass boardIdParam to <ReportGenerator /> if needed */}
          <ReportGenerator />
        </TabPanel>

        <TabPanel className="p-4 bg-white rounded-b-md shadow">
          {/* Pass boardIdParam as a prop to <ReportList /> */}
          <ReportList boardId={boardIdParam} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ReportManagement;
