import React, { useState } from 'react';
import { AppraisalView } from '../../types/appraisalView';
import AppraisalQuestionsList from './AppraisalQuestionsList';
import CreateAppraisalQuestion from './CreateAppraisalQuestion';
import UpdateAppraisalQuestion from './UpdateAppraisalQuestion';
import ViewAppraisalQuestion from './ViewAppraisalQuestion';
import AppraisalMetricsList from './AppraisalMetricsList';
import CreateAppraisalMetric from './CreateAppraisalMetric';
import UpdateAppraisalMetric from './UpdateAppraisalMetric';
import Button from '../common/Button/Button';
import {  FaPlus } from 'react-icons/fa';

const Appraisal: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppraisalView>(AppraisalView.LIST_QUESTIONS);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Questions' | 'Metrics'>('Questions');

  const renderView = () => {
    if (activeTab === 'Questions') {
      switch (currentView) {
        case AppraisalView.LIST_QUESTIONS:
          return (
            <AppraisalQuestionsList
              onView={(id) => {
                setSelectedQuestionId(id);
                setCurrentView(AppraisalView.VIEW_QUESTION);
              }}
              onEdit={(id) => {
                setSelectedQuestionId(id);
                setCurrentView(AppraisalView.EDIT_QUESTION);
              }}
            />
          );
        case AppraisalView.CREATE_QUESTION:
          return <CreateAppraisalQuestion onSuccess={() => setCurrentView(AppraisalView.LIST_QUESTIONS)} />;
        case AppraisalView.VIEW_QUESTION:
          return selectedQuestionId ? (
            <ViewAppraisalQuestion
              questionId={selectedQuestionId}
              onBack={() => setCurrentView(AppraisalView.LIST_QUESTIONS)}
            />
          ) : (
            <p className="text-red-500">No question selected.</p>
          );
        case AppraisalView.EDIT_QUESTION:
          return selectedQuestionId ? (
            <UpdateAppraisalQuestion
              questionId={selectedQuestionId}
              onSuccess={() => setCurrentView(AppraisalView.LIST_QUESTIONS)}
            />
          ) : (
            <p className="text-red-500">No question selected for editing.</p>
          );
        default:
          return <AppraisalQuestionsList onView={() => {}} onEdit={() => {}} />;
      }
    } else if (activeTab === 'Metrics') {
      switch (currentView) {
        case AppraisalView.LIST_METRICS:
          return (
            <AppraisalMetricsList
              onEdit={(id) => {
                setSelectedMetricId(id);
                setCurrentView(AppraisalView.EDIT_METRIC);
              }}
            />
          );
        case AppraisalView.CREATE_METRIC:
          return <CreateAppraisalMetric onSuccess={() => setCurrentView(AppraisalView.LIST_METRICS)} />;
        case AppraisalView.EDIT_METRIC:
          return selectedMetricId ? (
            <UpdateAppraisalMetric
              metricId={selectedMetricId}
              onSuccess={() => setCurrentView(AppraisalView.LIST_METRICS)}
            />
          ) : (
            <p className="text-red-500">No metric selected for editing.</p>
          );
        default:
          return <AppraisalMetricsList onEdit={() => {}} />;
      }
    }
  };

  const handleTabChange = (tab: 'Questions' | 'Metrics') => {
    setActiveTab(tab);
    setCurrentView(tab === 'Questions' ? AppraisalView.LIST_QUESTIONS : AppraisalView.LIST_METRICS);
    setSelectedQuestionId(null);
    setSelectedMetricId(null);
  };

  return (
    <div className="bg-blue-50 p-4 font-secondary">
      <div className="justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Appraisal Management</h2>
          <div className="flex space-x-3">
            <Button
              variant={activeTab === 'Questions' ? 'outline' : 'primary'}
              onClick={() => handleTabChange('Questions')}
              className='bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900 '
            >
              Questions
            </Button>
            <Button
              variant={activeTab === 'Metrics' ? 'outline' : 'primary'}
              onClick={() => handleTabChange('Metrics')}
            >
              Metrics
            </Button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {activeTab === 'Questions' ? (
            <Button
              variant="primary"
              leftIcon={<FaPlus />}
              onClick={() => setCurrentView(AppraisalView.CREATE_QUESTION)}
            >
              Create Question
            </Button>
          ) : (
            <Button
              variant="primary"
              leftIcon={<FaPlus />}
              onClick={() => setCurrentView(AppraisalView.CREATE_METRIC)}
            >
              Add Metric
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Appraisal;
