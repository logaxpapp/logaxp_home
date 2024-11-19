// src/components/ApprovalRequestDetails.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetApprovalRequestByIdQuery, useProcessApprovalRequestMutation } from '../api/approvalsApi';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import Notification from './Notification';
import AddStepModal from './AddStepModal'; // Ensure this component exists
import { IApprovalRequest, IApprovalStep, IApprovalHistory, IOtherRequestData, ILeaveRequestData, IExpenseRequestData, IAppraisalRequestData } from '../types/approval';

import { format, isValid } from 'date-fns';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaDollarSign,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa';

const ApprovalRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Approval request ID:', id);
  const { data, error, isLoading, refetch } = useGetApprovalRequestByIdQuery(id as string);

  console.log('Approval request details:', data);

  const user = useAppSelector(selectCurrentUser);

  console.log('User:', user);
  const currentUserId = user?._id;

  console.log('Current user:', currentUserId);
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [processApproval] = useProcessApprovalRequestMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-gray-500 text-lg">Loading approval request details...</p>
      </div>
    );
  }

  if (error || !data) { // No need to check data.data as transformResponse already extracts data
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-500 text-lg">Failed to load approval request details.</p>
      </div>
    );
  }

  const approval: IApprovalRequest = data;
  
  // Initialize displayStartDate and displayEndDate based on request_type
  let displayStartDate: string = approval.created_at;
  let displayEndDate: string = approval.updated_at;

  if (approval.request_type === 'Leave') {
    const leaveData = approval.request_data as ILeaveRequestData;
    displayStartDate = leaveData.start_date;
    displayEndDate = leaveData.end_date;
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render type-specific details with enhanced styling
  const renderTypeSpecificDetails = () => {
    switch (approval.request_type) {
      case 'Leave':
        const leaveData = approval.request_data as ILeaveRequestData;
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-lemonGreen-light w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Leave Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Leave Type:</strong> {leaveData.leave_type}
              </p>
              <p className="text-gray-700">
                <strong>Start Date:</strong> {format(new Date(leaveData.start_date), 'PP')}
              </p>
              <p className="text-gray-700">
                <strong>End Date:</strong> {format(new Date(leaveData.end_date), 'PP')}
              </p>
              <p className="text-gray-700">
                <strong>Reason:</strong> {leaveData.reason}
              </p>
            </div>
          </div>
        );
      case 'Expense':
        const expenseData = approval.request_data as IExpenseRequestData;
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-lemonGreen-light w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Expense Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Amount:</strong> {expenseData.amount} {expenseData.currency}
              </p>
              <p className="text-gray-700">
                <strong>Category:</strong> {expenseData.expense_category}
              </p>
              <p className="text-gray-700">
                <strong>Receipt:</strong>{' '}
                <a
                  href={expenseData.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lemonGreen-dark hover:underline flex items-center"
                >
                  View Receipt <FaFileAlt className="ml-2" />
                </a>
              </p>
            </div>
          </div>
        );
      case 'Appraisal':
        const appraisalData = approval.request_data as IAppraisalRequestData;
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-lemonGreen-light w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Appraisal Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Period:</strong> {appraisalData.period}
              </p>
              <p className="text-gray-700">
                <strong>Comments:</strong> {appraisalData.comments}
              </p>
            </div>

            {/* Display Additional Metrics */}
            <h4 className="text-lg font-medium mt-4">Metrics</h4>
            {appraisalData.additional_metrics && appraisalData.additional_metrics.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {appraisalData.additional_metrics.map((metric) => (
                  <li key={metric.metricId} className="text-gray-700">
                    <strong>Metric ID:</strong> {metric.metricId} — <strong>Value:</strong> {metric.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No additional metrics recorded.</p>
            )}

            {/* Display Responses to Appraisal Questions */}
            <h4 className="text-lg font-medium mt-4">Responses</h4>
            {appraisalData.responses && appraisalData.responses.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {appraisalData.responses.map((response) => (
                  <li key={response.questionId} className="text-gray-700">
                    <strong>Question ID:</strong> {response.questionId} — <strong>Answer:</strong> {response.answer}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No responses recorded for questions.</p>
            )}
          </div>
        );
      case 'Other':
        const otherData = approval.request_data as IOtherRequestData;
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-lemonGreen-light w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Other Request Details</h3>
            </div>
            <p className="text-gray-700">{otherData.details}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderWorkflow = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaCheckCircle className="text-lemonGreen-light w-6 h-6 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">Workflow Steps</h3>
      </div>
      {approval.steps && approval.steps.length > 0 ? (
        <ul className="space-y-4">
          {approval.steps.map((step: IApprovalStep, index: number) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                {step.status === 'Pending' && <FaClock className="text-yellow-400 w-5 h-5 mt-1" />}
                {step.status === 'Approved' && <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />}
                {step.status === 'Rejected' && <FaTimesCircle className="text-red-500 w-5 h-5 mt-1" />}
              </div>
              <div className="ml-4">
                <p className="text-gray-800 font-medium">{step.step_name}</p>
                <p className="text-gray-600">Approver: {step.approver.name} ({step.approver.email})</p>
                <p className="text-gray-600">
                  Status:{' '}
                  <span className={`font-semibold ${getStatusColor(step.status)} px-2 py-1 rounded-full`}>
                    {step.status}
                  </span>
                </p>
                {step.decision_date && (
                  <p className="text-gray-600">Decision Date: {format(new Date(step.decision_date), 'PPpp')}</p>
                )}
                {step.comments && <p className="text-gray-600">Comments: {step.comments}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No workflow steps available.</p>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaFileAlt className="text-lemonGreen-light w-6 h-6 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">Approval History</h3>
      </div>
      {approval.history && approval.history.length > 0 ? (
        <ul className="space-y-4">
          {approval.history.map((record: IApprovalHistory, index: number) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                {record.status === 'Approved' && <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />}
                {record.status === 'Rejected' && <FaTimesCircle className="text-red-500 w-5 h-5 mt-1" />}
              </div>
              <div className="ml-4">
                <p className="text-gray-800 font-medium">
                  {record.step_name} - {record.status}
                </p>
                <p className="text-gray-600">By: {record.approver.name} ({record.approver.email})</p>
                <p className="text-gray-600">Date: {format(new Date(record.decision_date), 'PPpp')}</p>
                {record.comments && <p className="text-gray-600">Comments: {record.comments}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No history available.</p>
      )}
    </div>
  );

  // Determine if the current user is the approver for the current step
  const isCurrentApprover =
    approval.steps &&
    approval.steps.length > approval.current_step &&
    approval.steps[approval.current_step].approver &&
    approval.steps[approval.current_step].approver._id === currentUserId;

  // Handler for finalizing approval
  const handleFinalizeApproval = async () => {
    const confirmMessage = window.confirm(
      'Do you want to approve this request? Click OK for "Approved" or Cancel for "Rejected".'
    )
      ? 'Approved'
      : 'Rejected';
    const comments = prompt('Enter any comments (optional):') || '';

    const status = confirmMessage as 'Approved' | 'Rejected';

    try {
      await processApproval({
        requestId: approval._id,
        action: 'finalize',
        status,
        comments,
      }).unwrap();

      setNotification({ open: true, message: `Request successfully ${status}.`, severity: 'success' });
      refetch();
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.data?.message || 'Failed to update approval.',
        severity: 'error',
      });
    }
  };

  // Handler for adding a new step
  const handleAddStep = async (newApproverId: string, stepName: string) => {
    const comments = prompt('Enter any comments (optional):') || '';

    try {
      await processApproval({
        requestId: approval._id,
        action: 'add_step',
        status: 'Approved', // Assuming approving the current step before adding a new one
        comments,
        newApproverId,
        stepName,
      }).unwrap();

      setNotification({ open: true, message: 'Approval updated and new step added successfully.', severity: 'success' });
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.data?.message || 'Failed to update approval.',
        severity: 'error',
      });
    }
  };

  return (
    <div className="mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <Link to="/dashboard/user-approvals" className="text-lemonGreen-light hover:text-lemonGreen-dark transition-colors">
          <FaArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold ml-4 text-gray-900">Approval Request Details</h1>
      </div>

      {/* General Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaFileAlt className="text-lemonGreen-light w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">General Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700">
              <strong>Type:</strong> {approval.request_type}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{' '}
              <span className={`ml-2 px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(approval.status)}`}>
                {approval.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <strong>Start Date:</strong>{' '}
              {isValid(new Date(displayStartDate)) ? format(new Date(displayStartDate), 'PP') : 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>End Date:</strong>{' '}
              {isValid(new Date(displayEndDate)) ? format(new Date(displayEndDate), 'PP') : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Type-Specific Details */}
      {renderTypeSpecificDetails()}

      {/* Workflow Steps */}
      {renderWorkflow()}

      {/* Approval History */}
      {renderHistory()}

      {/* Approval Actions (Only visible to the current approver) */}
      {isCurrentApprover && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Action</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleFinalizeApproval}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Approve Final
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Approve and Add Step
            </button>
            <button
              onClick={handleFinalizeApproval}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Add Step Modal */}
      <AddStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStep}
      />

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </div>
  );
};

export default ApprovalRequestDetails;
